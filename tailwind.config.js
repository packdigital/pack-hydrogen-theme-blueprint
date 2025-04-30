import headlessuiPlugin from '@headlessui/tailwindcss';

// default config: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './modules/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      xs: '30rem',
      sm: '40rem',
      md: '48rem',
      lg: '64rem',
      xl: '80rem',
      '2xl': '96rem',
    },
    fontSize: {
      '2xs': [
        '0.625rem',
        {
          lineHeight: '1rem',
        },
      ],
      xs: [
        '0.75rem',
        {
          lineHeight: '1rem',
        },
      ],
      sm: [
        '0.875rem',
        {
          lineHeight: '1.25rem',
        },
      ],
      base: [
        '1rem',
        {
          lineHeight: '1.5rem',
        },
      ],
      lg: [
        '1.125rem',
        {
          lineHeight: '1.75rem',
        },
      ],
      xl: [
        '1.25rem',
        {
          lineHeight: '1.75rem',
        },
      ],
      '2xl': [
        '1.5rem',
        {
          lineHeight: '2rem',
        },
      ],
      '3xl': [
        '1.875rem',
        {
          lineHeight: '2.25rem',
        },
      ],
      '4xl': [
        '2.25rem',
        {
          lineHeight: '2.5rem',
        },
      ],
      '5xl': [
        '3rem',
        {
          lineHeight: '1.25',
        },
      ],
      '6xl': [
        '3.75rem',
        {
          lineHeight: '1.25',
        },
      ],
      '7xl': [
        '4.5rem',
        {
          lineHeight: '1.25',
        },
      ],
      '8xl': [
        '6rem',
        {
          lineHeight: '1.25',
        },
      ],
      '9xl': [
        '8rem',
        {
          lineHeight: '1.25',
        },
      ],
    },
    extend: {
      fontFamily: {
        heading: ['"Barlow Condensed"', 'sans-serif'], // thin→bold
        sans: ['"Merriweather Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent1: 'var(--accent1)',
        accent2: 'var(--accent2)',
        black: 'var(--black)',
        neutralDarkest: 'var(--neutral-darkest)',
        neutralDarker: 'var(--neutral-darker)',
        neutralDark: 'var(--neutral-dark)',
        neutralMedium: 'var(--neutral-medium)',
        neutralLight: 'var(--neutral-light)',
        neutralLighter: 'var(--neutral-lighter)',
        neutralLightest: 'var(--neutral-lightest)',
        white: 'var(--white)',
        text: 'var(--text)',
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        overlay: 'var(--overlay)',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      animation: {
        'spin-fast': 'spin 0.75s linear infinite',
        'bounce-high': 'bounce-high 0.75s infinite',
        flash: 'flash 1.5s infinite',
        popIn: 'popIn 0.3s ease-out',
      },
      keyframes: {
        'bounce-high': {
          '0%, 100%': {
            transform: 'translateY(-50%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        popIn: {
          '0%': {opacity: 0, transform: 'scale(0.5)'},
          '100%': {opacity: 1, transform: 'scale(1)'},
        },
        flash: {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.1,
          },
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [headlessuiPlugin, require('tailwindcss-animate')],
};
