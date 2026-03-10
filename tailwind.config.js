/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Orange - #D97B41
        primary: {
          DEFAULT: '#D97B41',
          50: '#FDF5F0',
          100: '#FAEADE',
          200: '#F5D5C4',
          300: '#EFBFA9',
          400: '#E99D75',
          500: '#D97B41',
          600: '#C46230',
          700: '#9D4E26',
          800: '#763B1D',
          900: '#4F2713',
          light: '#EFBFA9',
          dark: '#C46230',
        },
        
        // Secondary Cool Beige - #D8BCAB
        secondary: {
          DEFAULT: '#D8BCAB',
          50: '#FAF7F4',
          100: '#F5EFE9',
          200: '#EBDFD3',
          300: '#E1CFBD',
          400: '#D8BCAB',
          500: '#C9A594',
          600: '#B8907D',
          700: '#9A7564',
          800: '#745749',
          900: '#4E3A31',
          light: '#F5EFE9',
          dark: '#9A7564',
        },
        
        // Neutral Warm Gray - #877A72
        neutral: {
          DEFAULT: '#877A72',
          50: '#F5F4F3',
          100: '#EBE9E7',
          200: '#D7D3CF',
          300: '#C3BDB7',
          400: '#AFA79F',
          500: '#877A72',
          600: '#6D615A',
          700: '#534942',
          800: '#3A312B',
          900: '#211814',
        },
        
        // Dark mode colors (warm tones)
        'dark-bg': '#1a1614',
        'dark-card': '#2d2a26',
        'dark-border': '#3a3632',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, #FAF7F4 0%, #F5EFE9 100%)',
      },
    },
  },
  plugins: [],
}