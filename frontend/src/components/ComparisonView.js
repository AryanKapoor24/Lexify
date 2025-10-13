'use client';

import { useState } from 'react';

export default function ComparisonView({ originalText, simplifiedText, searchTerm }) {
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Original Text */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Original Privacy Policy
            </h2>
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                highlightDifferences
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {highlightDifferences ? 'Hide' : 'Show'} Differences
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {originalText.split('\n').length} lines • {originalText.length.toLocaleString()} characters
          </p>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <pre 
            className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono"
            dangerouslySetInnerHTML={{ 
              __html: highlightText(originalText, searchTerm) 
            }}
          />
        </div>
      </div>

      {/* Simplified Text */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            AI-Simplified Version
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {simplifiedText.split('\n').length} lines • {simplifiedText.length.toLocaleString()} characters
          </p>
        </div>
        <div className="p-6 max-h-96 overflow-y-auto">
          <pre 
            className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: highlightText(simplifiedText, searchTerm) 
            }}
          />
        </div>
      </div>
    </div>
  );
}
