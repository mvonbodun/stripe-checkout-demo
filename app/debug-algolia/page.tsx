'use client';

import React, { useEffect, useState } from 'react';

interface DebugInfo {
  appId?: string;
  searchKey: 'present' | 'missing';
  nodeEnv?: string;
  browserContext: boolean;
}

export default function AlgoliaDebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);

  useEffect(() => {
    const info: DebugInfo = {
      appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
      searchKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY ? 'present' : 'missing',
      nodeEnv: process.env.NODE_ENV,
      browserContext: typeof window !== 'undefined',
    };
    
    console.log('Environment debug info:', info);
    setDebugInfo(info);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Algolia Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NEXT_PUBLIC_ALGOLIA_APP_ID
              </label>
              <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                {debugInfo?.appId || 'Not loaded'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
              </label>
              <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                {debugInfo?.searchKey || 'Not loaded'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Browser Context
              </label>
              <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                {debugInfo?.browserContext ? 'Yes' : 'No'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Node Environment
              </label>
              <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                {debugInfo?.nodeEnv || 'Not loaded'}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Next Steps</h3>
            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li>If environment variables are missing, check your .env.local file</li>
              <li>Make sure environment variable names start with NEXT_PUBLIC_</li>
              <li>Restart the development server after making changes</li>
              <li>Check browser console for additional error messages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
