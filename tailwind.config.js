/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  purge: ["./app/**/*.{ts,tsx}"],
  content: [],
  theme: {
    extend: {},
  },
  plugins: ["browser-node-builtins-polyfill-plugin"],
};
