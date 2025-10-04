"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<SessionProvider>
			<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
				{children}
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: 'var(--toast-bg)',
							color: 'var(--toast-color)',
							border: '1px solid var(--toast-border)',
						},
						success: {
							iconTheme: {
								primary: '#10b981',
								secondary: '#ffffff',
							},
						},
						error: {
							iconTheme: {
								primary: '#ef4444',
								secondary: '#ffffff',
							},
						},
					}}
				/>
			</ThemeProvider>
		</SessionProvider>
	);
}


