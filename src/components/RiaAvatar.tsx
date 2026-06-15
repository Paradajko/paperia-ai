type RiaAvatarProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: 'h-8 w-8 rounded-xl',
  md: 'h-12 w-12 rounded-2xl',
  lg: 'h-16 w-16 rounded-3xl',
};

export function RiaAvatar({ size = 'md' }: RiaAvatarProps) {
  return (
    <div
      className={`${sizes[size]} flex flex-none items-center justify-center border border-white/70 bg-night shadow-[0_12px_28px_rgba(11,23,38,0.18)]`}
      aria-label="Ria assistant mark"
      role="img"
    >
      <svg aria-hidden="true" viewBox="0 0 56 56" className="h-[76%] w-[76%]" fill="none">
        <path
          d="M11 35c6-10.4 14.7-14.5 26.2-12.4"
          stroke="#89D4C8"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d="M17 15h14.2c4.6 0 7.4 2.5 7.4 6.4 0 3.1-1.8 5.2-4.8 6l5.3 8.6h-6.3l-4.6-7.5H23V36h-6V15Zm6 4.8v4h7.5c1.3 0 2.1-.8 2.1-2s-.8-2-2.1-2H23Z"
          fill="#FFFCF6"
        />
        <path
          d="m29.5 40 3.2 3.2 7.8-9"
          stroke="#F0A08E"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
