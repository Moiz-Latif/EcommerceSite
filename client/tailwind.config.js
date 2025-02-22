/** @type {import('tailwindcss').Config} */
import { animations, keyframes } from 'framer-motion'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
        afacad: ['Afacad Flux', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
      },
      colors: {
        primary: {
          light: '#FAFAF9', // stone-50
          dark: '#000000',  // black
        }, keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          },
        },
        secondary: {
          light: '#E7E5E4', // stone-200
          dark: '#292524',  // stone-800
        },
        accent: {
          amber: '#F59E0B', // amber-500
          teal: '#0D9488',  // teal-600
        },
        engineering_orange: {
          DEFAULT: '#b80c09',
          100: '#250202',
          200: '#4a0503',
          300: '#6f0705',
          400: '#940907',
          500: '#b80c09',
          600: '#f4110d',
          700: '#f64d4a',
          800: '#f98886',
          900: '#fcc4c3',
        },
        indigo_dye: {
          DEFAULT: '#0b4f6c',
          100: '#021015',
          200: '#041f2b',
          300: '#062f40',
          400: '#083e55',
          500: '#0b4f6c',
          600: '#1282b2',
          700: '#29b0ea',
          800: '#70caf1',
          900: '#b8e5f8',
        },
        process_cyan: {
          DEFAULT: '#01baef',
          100: '#002530',
          200: '#004b5f',
          300: '#01708f',
          400: '#0196bf',
          500: '#01baef',
          600: '#28d0fe',
          700: '#5edbfe',
          800: '#93e7fe',
          900: '#c9f3ff',
        },
        ghost_white: {
          DEFAULT: '#fbfbff',
          100: '#000065',
          200: '#0000ca',
          300: '#3030ff',
          400: '#9595ff',
          500: '#fbfbff',
          600: '#fbfbff',
          700: '#fcfcff',
          800: '#fdfdff',
          900: '#fefeff',
        },
        rich_black: {
          DEFAULT: '#040f16',
          100: '#010304',
          200: '#020609',
          300: '#02090d',
          400: '#030c11',
          500: '#040f16',
          600: '#134767',
          700: '#227fb9',
          800: '#5baee1',
          900: '#add6f0',
        },
      },
    },
  },
}
