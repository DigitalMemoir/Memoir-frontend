import daisyui from 'daisyui';

const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'gray-0': '#eeeeee',
        'gray-1': '#e3e3e3',
        'gray-2': '#cccccc',
        'gray-3': '#b3b3b3',
        'background-light': '#f3f5f7',
        white: '#ffffff',
        'text-title': '#1c1c1c',
        'text-body': '#3f3f3f',
        'text-subtle': '#6c6c6c',
        'primary-100': '#e2e3ff',
        'primary-200': '#c5c7ff',
        'primary-300': '#a3a7ff',
        'primary-400': '#8387ff',
        'accent-yellow': '#ffe684',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(180deg, #ffffff 0%, #eeefff 100%)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        'memoir-theme': {
          primary: '#c5c7ff',
          secondary: '#ffe684',
          accent: '#a3a7ff',
          neutral: '#eeeeee',
          'base-100': '#ffffff',
          'base-200': '#f3f5f7',
          'base-300': '#e3e3e3',
          'base-content': '#1c1c1c',
          info: '#a3a7ff',
          success: '#a3ffa3',
          warning: '#ffe684',
          error: '#ff7070',
        },
      },
    ],
  },
};

export default config;
