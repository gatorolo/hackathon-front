/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Esto le dice a Tailwind que escanee todos los HTML y TS
  ],
  theme: {
    extend: {
      // Aquí podrías añadir colores personalizados para la Matrix
      colors: {
        matrix: {
          green: '#00FF41',
          dark: '#003B00',
        }
      }
    },
  },
  plugins: [],
}
