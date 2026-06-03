/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E86AB',
        secondary: '#A8DADC',
        background: '#F1FAEE',
        accent: '#457B9D',
        text: '#1D3557',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        plataforma: {
          primary: '#2E86AB',
          secondary: '#A8DADC',
          accent: '#457B9D',
          neutral: '#1D3557',
          'base-100': '#F1FAEE',
        },
      },
    ],
  },
}
