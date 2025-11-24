import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react'; // Ensure lucide-react is installed
import { useAppSelector } from '@/lib/store/hooks';
import { Token } from '@/types/token';

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
        {/* Backdrop overlay with blur */}
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        {/* The Modal Content */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-700 bg-black p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-4">
              <img src={token.logoUrl} alt={token.name} className="h-12 w-12 rounded-full bg-gray-800" />
              <div>
                <Dialog.Title className="text-xl font-bold text-white">
                  {token.name}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500">
                  {token.symbol} / USD
                </Dialog.Description>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Big Price Display */}
          <div className="py-6 text-center">
            <div className="text-5xl font-mono font-bold tracking-tight text-white mb-2">
              ${token.price.toFixed(4)}
            </div>
            <div className={`text-lg font-mono font-medium ${token.priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {token.priceChange24h >= 0 ? '▲' : '▼'} {Math.abs(token.priceChange24h).toFixed(2)}% (24h)
            </div>
          </div>

          {/* Data Grid */}
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Market Cap" value={`$${(token.marketCap / 1_000_000).toFixed(2)}M`} />
            <StatBox label="Volume (24h)" value={`$${(token.volume24h / 1_000_000).toFixed(2)}M`} />
            <StatBox label="Liquidity" value={`$${(token.liquidity / 1_000_000).toFixed(2)}M`} />
            <StatBox label="Transactions" value={token.transactions.toLocaleString()} />
          </div>

          {/* Fake Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors">
              Trade {token.symbol}
            </button>
            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors border border-gray-700">
              View Analytics
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
    <div className="text-xs text-gray-500 uppercase mb-1">{label}</div>
    <div className="text-lg font-mono text-gray-200">{value}</div>
  </div>
);