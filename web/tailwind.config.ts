import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // HelloSleep Brand Colors - Refined Palette
        brand: {
          // Primary - Buttons, highlights, key visuals (deeper orange for better contrast)
          primary: '#d35400',
          // Secondary - Accents, hover states, playful highlights (richer yellow)
          secondary: '#f39c12',
          // Background - Page background, soft UI areas (warmer cream)
          background: '#fef9e7',
          // Text colors
          'text-dark': '#2c3e50',    // Darker text for better readability
          'text-light': '#ecf0f1',   // Light text on dark backgrounds
          'text-light-alt': '#bdc3c7', // Alternative light text
        },
        // Semantic mappings for easy use
        primary: {
          50: '#fef9e7',   // Background
          100: '#fdebd0',  // Light background
          200: '#f8c471',  // Light accent
          300: '#f39c12',  // Secondary
          400: '#e67e22',  // Medium primary
          500: '#d35400',  // Primary (deeper)
          600: '#c0392b',  // Darker primary for hover
          700: '#a93226',  // Even darker for active
          800: '#7b241c',  // Dark text
          900: '#4a235a',  // Darkest text
        },
        // Supporting colors for better UI
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Success and error states
        success: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand': 'linear-gradient(135deg, #fef9e7 0%, #fdebd0 100%)',
        'gradient-hero': 'linear-gradient(135deg, #fef9e7 0%, #f39c12 50%, #d35400 100%)',
      },
    },
  },
  plugins: [],
}
export default config 