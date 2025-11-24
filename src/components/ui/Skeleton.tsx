interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = '' }: SkeletonProps) => {
  return (
    <div 
      className={`animate-pulse bg-gray-800/50 rounded-md ${className}`} 
    />
  );
};