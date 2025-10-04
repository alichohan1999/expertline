"use client";

import { useEffect, useRef } from 'react';

interface BaselineStatusWidgetProps {
  featureId?: string;
  isBaseline?: boolean;
  className?: string;
}

export default function BaselineStatusWidget({ 
  featureId, 
  isBaseline = false, 
  className = "" 
}: BaselineStatusWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the baseline-status web component if not already loaded
    if (typeof window !== 'undefined' && !customElements.get('baseline-status')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/baseline-status@1/baseline-status.min.js';
      script.type = 'module';
      document.head.appendChild(script);
    }
  }, []);

  // If we have a featureId, use the web component
  if (featureId) {
    return (
      <div className={className}>
        <baseline-status 
          featureId={featureId}
          ref={widgetRef}
        />
      </div>
    );
  }

  // Fallback to our custom baseline status indicator
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {isBaseline ? (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Reference
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Alternative
        </span>
      )}
    </div>
  );
}
