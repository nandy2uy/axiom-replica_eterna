// src/components/features/FilterTabs.tsx
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setFilter, FilterType } from '@/lib/store/tokenSlice';

const tabs: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All Tokens' },
  { id: 'new', label: 'New Pairs' },
  { id: 'final-stretch', label: 'Final Stretch' },
  { id: 'migrated', label: 'Migrated' },
];

export const FilterTabs = () => {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector((state) => state.tokens.filter);

  return (
    <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg border border-gray-800 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => dispatch(setFilter(tab.id))}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${currentFilter === tab.id 
              ? 'bg-gray-800 text-white shadow-sm border border-gray-700' 
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};