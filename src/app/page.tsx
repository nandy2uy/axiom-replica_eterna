// src/app/page.tsx
'use client';

import { useSocketWorker } from '@/hooks/useSocketWorker';
import TokenTable from '@/components/table/TokenTable';
import { FilterTabs } from '@/components/features/FilterTabs'; // <--- Import the Tabs

export default function Home() {
  // Start the engine
  useSocketWorker();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-950 text-white p-4 md:p-12">
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Token Discovery
            </h1>
            <p className="text-gray-500 mt-1">Live market data stream via Web Worker</p>
          </div>
          
          <div className="flex flex-col-reverse md:flex-row gap-4 items-start md:items-center">
            {/* The Actual Filtering Logic */}
            <FilterTabs />

            {/* Action Button */}
            <button className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm font-medium hover:bg-emerald-500/20 transition-colors whitespace-nowrap">
              + New Pair
            </button>
          </div>
        </div>

        {/* The Main Event */}
        <TokenTable />
        
      </div>
    </main>
  );
}