/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1726',
        night: '#064E3B',
        paper: '#F7F3EA',
        porcelain: '#FFFCF6',
        line: '#DDE8DF',
        slateblue: '#0F8A6A',
        harbor: '#0F8A6A',
        approval: '#0F8A6A',
        caution: '#9A6A08',
        coral: '#D97757',
      },
      boxShadow: {
        soft: '0 18px 55px rgba(16, 32, 51, 0.10)',
        agent: '0 24px 80px rgba(11, 23, 38, 0.16)',
        insetline: 'inset 0 1px 0 rgba(255, 255, 255, 0.65)',
      },
    },
  },
  plugins: [],
};
