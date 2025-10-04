import LoadingSpinner from "@/components/LoadingSpinner";

export default function PostsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Loading Posts...
          </h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
