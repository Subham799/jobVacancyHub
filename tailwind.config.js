/** @type {import('tailwindcss').Config} */
module.exports = {
  // The 'content' array specifies which files Tailwind CSS should scan
  // to identify used utility classes.
  content: [
    // This covers files in the 'pages' directory (for older Next.js Page Router)
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    // This covers files in a 'components' directory (if you create one at root level)
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    // This covers files directly within the 'app' directory and its subdirectories
    // (if you chose NOT to use the 'src' directory)
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    // This is CRITICAL if you chose to use the 'src' directory,
    // as your 'app' folder will be inside 'src'.
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // You can define custom theme configurations here (colors, fonts, spacing, etc.)
      // For example:
      // colors: {
      //   primary: '#6366F1',
      //   secondary: '#8B5CF6',
      // },
    },
  },
  plugins: [], // Add any Tailwind CSS plugins here (e.g., @tailwindcss/forms)
};