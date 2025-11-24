export interface Token {
  id: string;              // Unique Pair Address
  symbol: string;          // e.g., "WETH", "PEPE"
  name: string;
  price: number;
  priceChange24h: number;  // Percentage
  volume24h: number;
  liquidity: number;
  transactions: number;    // Tx count
  marketCap: number;
  logoUrl: string;         // For the visual pop
  status: 'new' | 'final-stretch' | 'migrated'; // For the tabs/filtering
}


export interface TokenState {
  ids: string[];
  entities: Record<string, Token>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  lastUpdated: number; // Timestamp for throttling checks
}

export type WorkerMessage = 
  | { type: 'INIT_DATA'; payload: Token[] }
  | { type: 'UPDATE_BATCH'; payload: Partial<Token>[] };

export type MainThreadMessage = 
  | { type: 'START_CONNECTION' }
  | { type: 'STOP_CONNECTION' }
  | { type: 'UPDATE_CONFIG'; payload: { speed: 'slow' | 'fast' } };


export type SortDirection = 'asc' | 'desc';
export type SortField = 'price' | 'volume24h' | 'liquidity' | 'transactions';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}