// src/components/table/TokenTable.tsx
'use client';

import { useRef, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAppSelector } from '@/lib/store/hooks';
import { selectFilteredAndSortedIds } from '@/lib/store/tokenSlice';
import TokenRow from './TokenRow';
import SortHeader from './SortHeader';
import { TableSkeleton } from './TableSkeleton';
import { TokenDetailModal } from '../features/TokenDetailModal'; // <--- Import Modal

export default function TokenTable() {
  const ids = useAppSelector(selectFilteredAndSortedIds);
  const status = useAppSelector((state) => state.tokens.status);
  
  // 1. Local State for Modal
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: ids.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, 
    overscan: 5,
  });

  // 2. Stable Handler (Prevents row re-renders)
  const handleRowClick = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  if (status === 'idle' || status === 'loading') {
    return <TableSkeleton />;
  }

  if (ids.length === 0) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center border border-gray-800 rounded-xl bg-gray-950 text-gray-500 font-mono">
        <p className="text-lg">No tokens found.</p>
        <p className="text-sm text-gray-600">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[600px] bg-gray-950 border border-gray-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center px-6 py-3 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-10 sticky top-0">
          <SortHeader label="Token" align="left" className="flex-[2]" />
          <SortHeader label="Price" field="price" className="flex-1" />
          {/* Cast 'as any' to fix temp TS SortField issue */}
          <SortHeader label="24h Change" field={"priceChange24h" as any} className="flex-1" />
          <SortHeader label="Volume (24h)" field="volume24h" className="flex-1 hidden sm:flex" />
          <SortHeader label="Liquidity" field="liquidity" className="flex-1 hidden md:flex" />
        </div>

        {/* Virtual Body */}
        <div 
          ref={parentRef} 
          className="flex-1 overflow-auto custom-scrollbar relative"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <TokenRow
                key={virtualRow.key}
                id={ids[virtualRow.index] as string}
                index={virtualRow.index}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={handleRowClick} // <--- Pass Handler
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Render Modal */}
      <TokenDetailModal 
        tokenId={selectedId} 
        onClose={() => setSelectedId(null)} 
      />
    </>
  );
}