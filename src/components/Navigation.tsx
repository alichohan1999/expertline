import Link from "next/link";
import NextImage from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AuthButton from "./AuthButton";
import SettingsDropdown from "./SettingsDropdown";

export default async function Navigation() {
  const session = await getServerSession(authOptions);
  
  let isAdmin = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    isAdmin = user?.role === "ADMIN";
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
                <NextImage
                  src="/logos/expertline-logo-s-t-d.svg"
                  alt="Expertline"
                  width={40}
                  height={40}
                  className="hidden dark:block group-hover:scale-105 transition-transform duration-200"
                />
                <NextImage
                  src="/logos/expertline-logo-s-t-l.svg"
                  alt="Expertline"
                  width={40}
                  height={40}
                  className="dark:hidden block group-hover:scale-105 transition-transform duration-200"
                />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
              Expertline
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium">
              Home
            </Link>
            <Link href="/topics" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium">
              Topics
            </Link>
            <Link href="/posts" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium">
              Posts
            </Link>
            <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-medium">
              About
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium">
                Admin
              </Link>
            )}
            <SettingsDropdown />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
