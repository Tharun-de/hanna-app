import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Accent color classes for dynamic generation
    'text-rose-400',
    'text-purple-400', 
    'text-blue-400',
    'text-red-400',
    'text-amber-400',
    'text-emerald-400',
    'hover:text-rose-400',
    'hover:text-purple-400',
    'hover:text-blue-400', 
    'hover:text-red-400',
    'hover:text-amber-400',
    'hover:text-emerald-400',
    'bg-rose-400',
    'bg-purple-400',
    'bg-blue-400',
    'bg-red-400', 
    'bg-amber-400',
    'bg-emerald-400',
    // Additional dynamic classes
    'highlight-scroll-target'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#e5e7eb',
            lineHeight: '1.75',
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};