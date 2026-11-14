/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0d0821',
          purple: '#4b3fbc',
          'purple-hover': '#3d32a0',
          'purple-light': '#f3f1fc',
          'purple-border': '#e3dff7',
          surface: '#f8fafc',
          muted: '#64748b',
          border: '#e2e8f0',
        },
      },
    },
  },
  plugins: [],
};
