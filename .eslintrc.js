module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  extends: ["eslint:recommended", "eslint-config-prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-var": "error",
    "no-unused-vars": "warn",
    "no-empty": "warn",
    "func-style": ["error", "declaration", { allowArrowFunctions: true }],
  },
};
