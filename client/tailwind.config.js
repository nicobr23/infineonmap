/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    
    extend: {
      colors:{
        "ocean": '#0A8276',
        "ocean-20": '#DFF4F3',
        "ocean-40": '#B8DEDA',
        "ocean-60": '#6CB4AD',
        "ocean-80": '#3B9B91'
      },
      screens: {
        'mobile': '450px',
        // => @media (min-width: 450px) { ... }
        'tablet': '640px',
        // => @media (min-width: 640px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'desktop': '1280px',
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [],
};
