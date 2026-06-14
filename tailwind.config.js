/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        rounded: ['Nunito', 'Pretendard', 'ui-rounded', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        pop: '0 16px 0 rgba(30, 41, 59, 0.12)',
        soft: '0 20px 60px rgba(15, 23, 42, 0.14)'
      }
    }
  },
  plugins: []
}
