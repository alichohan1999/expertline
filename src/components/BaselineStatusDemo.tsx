"use client";

import { useState } from 'react';
import RealtimeBaselineStatus from './RealtimeBaselineStatus';

const demoCodeSamples = [
  {
    name: 'CSS Grid Layout',
    code: `
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}

.item {
  grid-area: 1 / 1 / 2 / 2;
}`,
    description: 'Modern CSS Grid with baseline support'
  },
  {
    name: 'Fetch API with Async/Await',
    code: `
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
}`,
    description: 'Modern JavaScript with Promise-based API'
  },
  {
    name: 'Web Components',
    code: `
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`<h1>Hello World</h1>\`;
  }
}

customElements.define('my-component', MyComponent);`,
    description: 'Custom Web Components with modern APIs'
  },
  {
    name: 'CSS Custom Properties',
    code: `
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}

.button {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-md, 12px);
}`,
    description: 'CSS Variables with fallback values'
  },
  {
    name: 'ES6 Modules',
    code: `
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => handler.cancel();
  }, [value, delay]);
  
  return debouncedValue;
};`,
    description: 'Modern ES6 modules with React hooks'
  }
];

export default function BaselineStatusDemo() {
  const [selectedCode, setSelectedCode] = useState(demoCodeSamples[0]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Real-time Baseline Status Detection
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This demo shows how our system automatically detects web features in your code 
          and displays their baseline status in real-time using the webstatus.dev API.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Code Selection */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Select Code Sample
          </h3>
          <div className="space-y-2">
            {demoCodeSamples.map((sample, index) => (
              <button
                key={index}
                onClick={() => setSelectedCode(sample)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedCode === sample
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {sample.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {sample.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Baseline Status Display */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Real-time Baseline Status
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {selectedCode.name}
              </h4>
              <RealtimeBaselineStatus 
                code={selectedCode.code}
                isBaseline={true}
              />
            </div>
            
            <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-3">
              <pre className="text-sm text-gray-100 overflow-x-auto">
                <code>{selectedCode.code.trim()}</code>
              </pre>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              The system automatically detects web features like CSS Grid, Fetch API, 
              Web Components, and more, then fetches their baseline status from the 
              webstatus.dev API to show real-time compatibility information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
