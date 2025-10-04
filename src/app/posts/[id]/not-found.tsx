import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
