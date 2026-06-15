/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#102033',
        night: '#0B1726',
        paper: '#F7F3EA',
        porcelain: '#FFFCF6',
        line: '#E7DED0',
        slateblue: '#1f4f75',
        harbor: '#0f766e',
        approval: '#166534',
        caution: '#a16207',
        coral: '#C96F5B',
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
