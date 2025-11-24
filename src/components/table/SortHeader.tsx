import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSort } from '@/lib/store/tokenSlice';
import { SortField } from '@/types/token';
import { ArrowDown, ArrowUp } from 'lucide-react'; // Make sure to npm install lucide-react if you haven't

interface HeaderProps {
  label: string;
  field?: SortField; // Optional, because "Token" column might not be sortable or uses a different logic
  align?: 'left' | 'right';
  className?: string;
}

const SortHeader = ({ label, field, align = 'right', className = '' }: HeaderProps) => {
  const dispatch = useAppDispatch();
  const sortConfig = useAppSelector((state) => state.tokens.sortConfig);

  const isActive = sortConfig.field === field;

  const handleSort = () => {
    if (field) dispatch(setSort(field));
  };

  return (
    <div 
      onClick={handleSort}
      className={`
        flex items-center gap-1 cursor-pointer hover:text-white transition-colors select-none
        ${align === 'right' ? 'justify-end' : 'justify-start'}
        ${isActive ? 'text-emerald-400' : 'text-gray-500'}
        ${className}
      `}
    >
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      {isActive && field && (
        sortConfig.direction === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />
      )}
    </div>
  );
};

export default SortHeader;