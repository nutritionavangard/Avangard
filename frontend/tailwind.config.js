/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aquí definimos los colores Premium que hablamos
        'avangard-black': '#0a0a0a',
        'avangard-gold': '#c5a059', // Un dorado sutil para detalles
        'avangard-gray': '#f4f4f4',
      },
      fontFamily: {
        // Montserrat o Inter son geniales para el look elite
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}