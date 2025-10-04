"use client";

interface BaselineStatusIconProps {
  isBaseline?: boolean;
  status?: 'baseline' | 'newly-interoperable' | 'limited-browser-support' | 'not-baseline' | 'alternative';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BaselineStatusIcon({ 
  isBaseline = false, 
  status = 'alternative',
  size = 'md',
  className = "" 
}: BaselineStatusIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  const iconSize = sizeClasses[size];

  // Determine the badge based on status
  if (isBaseline || status === 'baseline') {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800 ${className}`} title="Baseline - Widely supported across all modern browsers">
        <div className="w-2 h-2 bg-green-600 rounded-full mr-1"></div>
        Baseline
      </div>
    );
  }

  if (status === 'newly-interoperable') {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800 ${className}`} title="Newly Interoperable - Recently standardized">
        <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
        Newly Interop
      </div>
    );
  }

  if (status === 'limited-browser-support') {
    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 border border-orange-200 dark:border-orange-800 ${className}`} title="Limited Browser Support - Check compatibility">
        <div className="w-2 h-2 bg-orange-600 rounded-full mr-1"></div>
        Limited Support
      </div>
    );
  }

  // Default alternative badge
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700 ${className}`} title="Alternative - Different approach">
      <div className="w-2 h-2 bg-gray-500 rounded-full mr-1"></div>
      Alternative
    </div>
  );
}
