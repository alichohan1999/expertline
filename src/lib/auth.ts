import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			role: string;
			username: string;
		} & DefaultSession["user"];
	}
}


// Export authOptions for use with getServerSession
export const authOptions = {
	// adapter: PrismaAdapter(prisma), // Temporarily disabled for debugging
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		}),
		Credentials({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email }
				});

				if (!user || !user.password) {
					return null;
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isPasswordValid) {
					return null;
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image,
					username: user.username,
					role: user.role,
				};
			}
		})
	],
	callbacks: {
		async signIn({ user, account, profile }: any) {
			// For OAuth providers, manually handle user creation since we're not using PrismaAdapter
			if (account?.provider === "google") {
				try {
					// Check if user exists by email
					const existingUser = await prisma.user.findUnique({
						where: { email: user.email }
					});

					if (!existingUser) {
						// Create user if doesn't exist
						const username = user.name?.toLowerCase().replace(/\s+/g, '') || 
									   user.email?.split('@')[0] || 'user';
						
						// Check if username is already taken
						let finalUsername = username;
						let counter = 1;
						while (await prisma.user.findUnique({ where: { username: finalUsername } })) {
							finalUsername = `${username}${counter}`;
							counter++;
						}
						
						await prisma.user.create({
							data: {
								email: user.email!,
								name: user.name || '',
								image: user.image || '',
								username: finalUsername,
								emailVerified: new Date(),
							}
						});
					} else {
						// User exists, update their image if needed
						if (user.image && existingUser.image !== user.image) {
							await prisma.user.update({
								where: { id: existingUser.id },
								data: { image: user.image }
							});
						}
					}

					return true;
				} catch (error) {
					console.error("Error in signIn callback:", error);
					return false;
				}
			}
			return true;
		},
		async session({ session, token }: any) {
			// Add custom fields to session
			if (session.user && token?.id) {
				try {
					const dbUser = await prisma.user.findUnique({
						where: { id: token.id }
					});
					
					if (dbUser) {
						session.user.id = dbUser.id;
						session.user.username = dbUser.username;
						session.user.role = dbUser.role;
						session.user.image = dbUser.image; // Ensure image is set from database
					} else {
						// Try to find by email as fallback
						if (session.user.email) {
							const userByEmail = await prisma.user.findUnique({
								where: { email: session.user.email }
							});
							if (userByEmail) {
								session.user.id = userByEmail.id;
								session.user.name = userByEmail.name;
								session.user.email = userByEmail.email;
								session.user.image = userByEmail.image;
								session.user.username = userByEmail.username;
								session.user.role = userByEmail.role;
							}
						}
					}
				} catch (error) {
					console.error("Error fetching user in session callback:", error);
				}
			}
			return session;
		},
		async jwt({ token, user, account }: any) {
			// If user exists (first time signing in), get user data from database
			if (user && account) {
				try {
					const dbUser = await prisma.user.findUnique({
						where: { email: user.email }
					});
					
					if (dbUser) {
						token.id = dbUser.id;
						token.username = dbUser.username;
						token.role = dbUser.role;
					}
				} catch (error) {
					console.error("Error fetching user in JWT callback:", error);
				}
			}
			return token;
		},
	},
	session: {
		strategy: "jwt" as const,
	},
	pages: {
		signIn: "/auth/signin",
		signUp: "/auth/signup",
	},
	debug: process.env.NODE_ENV === "development",
	secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

export function requireRole(roles: string[]) {
	return async () => {
		const session = await auth();
		if (!session || !session.user || !roles.includes((session.user as any).role)) {
			return null;
		}
		return session;
	};
}


