/* eslint-disable-next-line no-undef */
const functions = require("firebase-functions");


module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
  
};

module.exports = {
  env: {
    es6: true,
    node: true, // This tells ESLint you're in a Node.js environment
  },
  extends: [
    "eslint:recommended",
    "google", // If using Google's ESLint style guide; otherwise, use your preferred style
  ],
  parserOptions: {
    ecmaVersion: 2020, // Latest ECMAScript syntax support
  },
  rules: {
    // Add any custom rules here if needed
  },
};
