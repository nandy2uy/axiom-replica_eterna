import * as Dialog from '@radix-ui/react-dialog';
import { X, Terminal } from 'lucide-react'; // Added Terminal icon for that "CMD" vibe
import { useAppSelector } from '@/lib/store/hooks';

interface TokenDetailModalProps {
  tokenId: string | null;
  onClose: () => void;
}

export const TokenDetailModal = ({ tokenId, onClose }: TokenDetailModalProps) => {
  const token = useAppSelector((state) => 
    tokenId ? state.tokens.entities[tokenId] : null
  );

  if (!token) return null;

  return (
    <Dialog.Root open={!!tokenId} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* 1. THE BACKDROP (This dims the table behind the modal) */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        {/* 2. THE WINDOW (The "CMD" Box) */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border border-gray-700 bg-[#050505] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
          
          {/* "CMD" Style Header Bar */}
          <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/50 px-6 py-3 sm:rounded-t-lg">
            <div className="flex items-center gap-2 text-gray-400">
              <Terminal size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">Terminal // {token.symbol}</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            
            {/* Token Identity */}
            <div className="flex items-center gap-4 mb-8">
              <img 
                src={token.logoUrl} 
                alt={token.name} 
                className="h-16 w-16 rounded-full bg-gray-800 ring-2 ring-gray-800 shadow-lg" 
              />
              <div>
                <Dialog.Title className="text-2xl font-bold text-white tracking-tight">
                  {token.name}
                </Dialog.Title>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    VERIFIED
                  </span>
                  <span className="text-sm text-gray-500 font-mono">
                    {token.id.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>

            {/* Price Hero Section */}
            <div className="text-center py-4 bg-gray-900/20 rounded-xl border border-gray-800/50 mb-8">
              <div className="text-sm text-gray-500 uppercase tracking-widest mb-1">Current Price</div>
              <div className="text-5xl font-mono font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                ${token.price.toFixed(4)}
              </div>
              <div className={`text-lg font-mono font-medium mt-2 ${token.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {token.priceChange24h >= 0 ? '▲' : '▼'} {Math.abs(token.priceChange24h).toFixed(2)}%
              </div>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Market Cap" value={`$${(token.marketCap / 1_000_000).toFixed(2)}M`} />
              <StatBox label="24h Volume" value={`$${(token.volume24h / 1_000_000).toFixed(2)}M`} />
              <StatBox label="Liquidity" value={`$${(token.liquidity / 1_000_000).toFixed(2)}M`} />
              <StatBox label="Holders" value={token.transactions.toLocaleString()} />
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
                Trade Now
              </button>
            </div>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-900/30 p-3 rounded border border-gray-800 hover:border-gray-700 transition-colors">
    <div className="text-[10px] text-gray-500 uppercase mb-1 font-bold tracking-wider">{label}</div>
    <div className="text-base font-mono text-gray-200">{value}</div>
  </div>
);