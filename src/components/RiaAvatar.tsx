import riaGuide from '../assets/ria-guide-half.png';

type RiaAvatarProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

const sizeClasses: Record<NonNullable<RiaAvatarProps['size']>, string> = {
  sm: 'h-8 w-8',
  md: 'h-16 w-16',
  lg: 'h-32 w-32',
  xl: 'h-64 w-64 sm:h-72 sm:w-72',
};

export function RiaAvatar({ size = 'md', className = '' }: RiaAvatarProps) {
  return (
    <img
      src={riaGuide}
      alt="Ria, your residence guide for Slovakia"
      className={`${sizeClasses[size]} rounded-full border border-[#BFE6D2] bg-[#EEF7F1] object-cover object-top shadow-sm ${className}`}
    />
  );
}
