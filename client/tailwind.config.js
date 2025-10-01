/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [

    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        'bg-dark-primary': '#1E1E1E', // Fondo principal (cuerpo)
        'bg-dark-secondary': '#121212', // Fondo muy oscuro (Sidebar, tarjetas)
        'bg-dark-active': '#383535', // Fondo de elementos activos/hover

        // Acentos y Énfasis
        'accent-primary': '#2E86AB', // Azul primario (botones, focos)
        'accent-secondary': '#56B1BF', // Azul de acento (iconos, resaltar)
        
        // Texto
        'text-light': '#E0E0E0', // Texto principal claro
        'text-muted': '#A8A8A8', // Texto secundario / muted
      },

      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: {    
    tailwindcss: {},
    autoprefixer: {},
  },
}