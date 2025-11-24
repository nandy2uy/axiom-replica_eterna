import { createSlice, createEntityAdapter, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Token, SortConfig, SortField } from '@/types/token';

// 1. Define Filter Types
export type FilterType = 'all' | 'new' | 'final-stretch' | 'migrated';

const tokenAdapter = createEntityAdapter<Token, string>({
  selectId: (token) => token.id,
});

// 2. Add 'filter' to the initial state
const initialState = tokenAdapter.getInitialState({
  status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
  lastUpdated: Date.now(),
  sortConfig: { field: 'volume24h', direction: 'desc' } as SortConfig,
  filter: 'all' as FilterType, // <--- NEW
});

const tokenSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setInitialData: (state, action: PayloadAction<Token[]>) => {
      tokenAdapter.setAll(state, action.payload);
      state.status = 'succeeded' as const;
    },
    updateTokenBatch: (state, action: PayloadAction<Partial<Token>[]>) => {
      action.payload.forEach(update => {
        if (update.id) {
          tokenAdapter.updateOne(state, { id: update.id, changes: update });
        }
      });
      state.lastUpdated = Date.now();
    },
    setSort: (state, action: PayloadAction<SortField>) => {
      const currentSort = state.sortConfig;
      if (currentSort.field === action.payload) {
        state.sortConfig.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortConfig.field = action.payload;
        state.sortConfig.direction = 'desc';
      }
    },
    // 3. New Action: Set Filter
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
  },
});

export const { setInitialData, updateTokenBatch, setSort, setFilter } = tokenSlice.actions;

// Base selectors
// Note: We access state.tokens assuming the root reducer is named 'tokens'
const { selectAll } = tokenAdapter.getSelectors((state: { tokens: typeof initialState }) => state.tokens);
const selectSortConfig = (state: { tokens: typeof initialState }) => state.tokens.sortConfig;
const selectFilter = (state: { tokens: typeof initialState }) => state.tokens.filter; // <--- NEW

// 4. The Ultimate Selector: Filter First, Then Sort
export const selectFilteredAndSortedIds = createSelector(
  [selectAll, selectSortConfig, selectFilter],
  (tokens, sortConfig, filter) => {
    // A. Filter Step
    const filtered = tokens.filter((t) => {
      if (filter === 'all') return true;
      return t.status === filter;
    });

    // B. Sort Step
    const sorted = filtered.sort((a, b) => {
      // We use 'as keyof Token' to keep TypeScript happy with dynamic access
      const aValue = a[sortConfig.field as keyof Token];
      const bValue = b[sortConfig.field as keyof Token];

      // Handle number comparisons
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Fallback for non-numbers (though in this app they are mostly numbers)
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    // C. Return only IDs for the virtualizer
    return sorted.map(t => t.id);
  }
);

export default tokenSlice.reducer;