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
  plugins: [],
};

export default config;
