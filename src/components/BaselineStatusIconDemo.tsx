"use client";

import BaselineStatusIcon from './BaselineStatusIcon';

export default function BaselineStatusIconDemo() {
  const statuses = [
    { isBaseline: true, status: 'baseline' as const, label: 'Baseline - Widely supported' },
    { isBaseline: false, status: 'newly-interoperable' as const, label: 'Newly Interoperable - Recently standardized' },
    { isBaseline: false, status: 'limited-browser-support' as const, label: 'Limited Browser Support - Check compatibility' },
    { isBaseline: false, status: 'alternative' as const, label: 'Alternative - Different approach' }
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Baseline Status Icons
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statuses.map((status, index) => (
          <div key={index} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <BaselineStatusIcon 
              isBaseline={status.isBaseline}
              status={status.status}
              size="md"
            />
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {status.label.split(' - ')[0]}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {status.label.split(' - ')[1]}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Badge Meanings:
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">● Baseline</span> Widely supported across all modern browsers</li>
          <li><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">● Newly Interop</span> Recently standardized, good browser support</li>
          <li><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">● Limited Support</span> Check browser compatibility before using</li>
          <li><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mr-2">● Alternative</span> Different approach or implementation</li>
        </ul>
      </div>
    </div>
  );
}
