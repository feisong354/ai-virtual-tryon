/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tech-blue': '#3498db',
        'tech-dark': '#2c3e50',
        'light-gray': '#f5f7fa',
        'medium-gray': '#e2e8f0',
      },
      fontFamily: {
        'sans': ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
