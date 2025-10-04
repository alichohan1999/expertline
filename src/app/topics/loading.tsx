
export default function TopicsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Loading Topics...
          </h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-16"></div>
                  ))}
                </div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
