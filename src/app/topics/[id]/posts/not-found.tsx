import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">404 - Topic Not Found</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
        The topic you are looking for does not exist or has been moved.
      </p>
      <Link href="/topics" className="text-blue-600 dark:text-blue-400 hover:underline text-lg">
        Go back to all topics
      </Link>
    </div>
  );
}
