import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
export default [
  { ignores: ["dist/**", "node_modules/**", "artifacts/**"] },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react },
    rules: { "react/jsx-uses-react": "error", "react/jsx-uses-vars": "error" },
  },
  {
    files: ["tests/*.cjs", "scripts/*.mjs"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
