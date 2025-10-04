"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProfileImage from "./ProfileImage";

export default function AuthButton() {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return (
			<div className="flex items-center gap-2">
				<div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
				<span className="text-sm text-gray-500">Loading...</span>
			</div>
		);
	}

	if (session) {
		return (
			<div className="flex items-center gap-3">
				<Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
					<ProfileImage
						src={session.user?.image || null}
						alt="User Avatar"
						className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
						fallbackSrc="/default-avatar.svg"
					/>
					<span className="hidden sm:block">{session.user?.name || session.user?.email}</span>
				</Link>
			</div>
		);
	}

		return (
			<div className="flex items-center gap-3">
				<Link
					href="/auth/signin"
					className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
				>
					Sign In
				</Link>
				<Link
					href="/auth/signup"
					className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-hover dark:bg-primary dark:bg-primary-hover dark:text-primary-foreground px-3 py-1.5 rounded-md transition-colors"
				>
					Sign Up
				</Link>
			</div>
	);
}


