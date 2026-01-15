/** @type {import('tailwindcss').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            900: '#0a1e3f', // Bleu marine foncé
            800: '#1e3a8a',
            700: '#1e40af',
          },
          yellow: {
            400: '#fbbf24',
            500: '#f59e0b',
          },
        },
      },
    },
  },
};

export default config;

