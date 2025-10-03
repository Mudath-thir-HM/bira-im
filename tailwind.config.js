/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#0066FF',      // You can adjust these colors
        'brand-secondary': '#00CC99',    // to match your desired brand colors
        'brand-surface': '#FFFFFF',
        'brand-text-primary': '#1A1A1A',
      },
    },
  },
  plugins: [],
};
