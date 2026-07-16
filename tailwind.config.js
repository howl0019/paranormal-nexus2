export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090f',
        surface: '#11121a',
        panel: '#151725',
        border: '#323448',
        accent: '#65a6ff',
        danger: '#f97373',
        warn: '#fbbf24',
        success: '#4ade80'
      },
      boxShadow: {
        panel: '0 12px 40px rgba(0,0,0,0.35)'
      }
    },
  },
  plugins: [],
};
