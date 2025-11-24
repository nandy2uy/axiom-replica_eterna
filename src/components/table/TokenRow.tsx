// src/components/table/TokenRow.tsx
import { memo, useMemo } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { useFlash } from '@/hooks/useFlash'; // <--- IMPORT THIS

interface TokenRowProps {
  id: string;
  style: React.CSSProperties;
  index: number;
  onClick: (id: string) => void;
}

const TokenRow = ({ id, style, index, onClick }: TokenRowProps) => {
  const token = useAppSelector((state) => state.tokens.entities[id]);
  
  // 1. Hook into the price updates for animation
  const flash = useFlash(token?.price || 0);

  // 2. Memoize static colors (24h change)
  const { changeColor, Sign } = useMemo(() => {
    if (!token) return { changeColor: 'text-gray-500', Sign: '' };
    const isPositive = token.priceChange24h >= 0;
    return {
      changeColor: isPositive ? 'text-emerald-400' : 'text-rose-500',
      Sign: isPositive ? '+' : ''
    };
  }, [token?.priceChange24h]);

  if (!token) return null;

  // 3. Dynamic Flash CSS
  // Green Flash = bg-emerald, Red Flash = bg-rose
  // If flash is null, revert to transparent bg and gray text with a slow fade (duration-500)
  // Dynamic Flash CSS with GLOW (Shadow)
  const flashClass = flash === 'green'
    ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)] transition-none' // Green Glow
    : flash === 'red'
    ? 'bg-rose-500/10 text-rose-400 shadow-[0_0_15px_-3px_rgba(244,63,94,0.4)] transition-none'      // Red Glow
    : 'bg-transparent text-gray-200 transition-colors duration-500';
    
  return (
    <div
      style={style}
      // Add onClick handler and cursor-pointer class
      onClick={() => onClick(id)} 
      className={`absolute top-0 left-0 w-full flex items-center px-6 py-3 border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors duration-150 group cursor-pointer ${
        index % 2 === 0 ? 'bg-transparent' : 'bg-gray-900/20'
      }`}
    >
      {/* Token Info */}
      <div className="flex-[2] flex items-center gap-4 min-w-0">
        <div className="relative w-8 h-8 flex-shrink-0">
          <img 
            src={token.logoUrl} 
            alt={token.symbol} 
            style={{ width: '32px', height: '32px' }}
            className="rounded-full object-cover bg-gray-800 ring-2 ring-gray-800"
            loading="lazy" 
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-100 text-sm truncate">{token.name}</span>
          <span className="text-xs text-gray-500 font-medium">{token.symbol}</span>
        </div>
      </div>

      {/* PRICE COLUMN - THIS IS WHERE THE FLASH HAPPENS */}
      <div className="flex-1 text-right font-mono text-sm tabular-nums tracking-tight">
        <span className={`px-2 py-1 rounded-md ${flashClass}`}>
          ${token.price.toFixed(4)}
        </span>
      </div>

      {/* 24h Change */}
      <div className={`flex-1 text-right font-mono text-sm tabular-nums tracking-tight ${changeColor}`}>
        {Sign}{token.priceChange24h.toFixed(2)}%
      </div>

      {/* Volume */}
      <div className="flex-1 text-right font-mono text-sm text-gray-500 hidden sm:block tabular-nums">
        ${(token.volume24h / 1_000_000).toFixed(2)}M
      </div>
      
      {/* Liquidity */}
      <div className="flex-1 text-right font-mono text-sm text-gray-500 hidden md:block tabular-nums">
        ${(token.liquidity / 1_000_000).toFixed(2)}M
      </div>
    </div>
  );
};

export default memo(TokenRow, (prev, next) => {
  return prev.id === next.id && prev.index === next.index && prev.style.top === next.style.top;
});