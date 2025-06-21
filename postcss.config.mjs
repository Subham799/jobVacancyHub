// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Using the specific plugin you mentioned
    autoprefixer: {}, // Essential for adding vendor prefixes
  },
};
export default config;