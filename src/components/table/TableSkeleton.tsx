import { Skeleton } from "../ui/Skeleton";

export const TableSkeleton = () => {
  // Generate 15 fake rows
  const rows = Array(15).fill(0);

  return (
    <div className="w-full h-[600px] bg-gray-950 border border-gray-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
      {/* Fake Header */}
      <div className="flex items-center px-6 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex-[2]"><Skeleton className="h-4 w-16" /></div>
        <div className="flex-1"><Skeleton className="h-4 w-12 ml-auto" /></div>
        <div className="flex-1"><Skeleton className="h-4 w-16 ml-auto" /></div>
        <div className="flex-1 hidden sm:block"><Skeleton className="h-4 w-20 ml-auto" /></div>
        <div className="flex-1 hidden md:block"><Skeleton className="h-4 w-20 ml-auto" /></div>
      </div>

      {/* Fake Rows */}
      <div className="flex-1 overflow-hidden">
        {rows.map((_, i) => (
          <div 
            key={i} 
            className="flex items-center px-6 py-3 border-b border-gray-800/50"
          >
            {/* Token Info Skeleton */}
            <div className="flex-[2] flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>

            {/* Price Skeleton */}
            <div className="flex-1">
              <Skeleton className="h-5 w-20 ml-auto" />
            </div>

            {/* Change Skeleton */}
            <div className="flex-1">
              <Skeleton className="h-5 w-16 ml-auto" />
            </div>

            {/* Volume Skeleton */}
            <div className="flex-1 hidden sm:block">
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>

             {/* Liquidity Skeleton */}
             <div className="flex-1 hidden md:block">
              <Skeleton className="h-4 w-24 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};