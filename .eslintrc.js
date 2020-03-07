module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    project: ["tsconfig.json"],
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    "react/prop-types": "off",
    "react/display-name": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [1, { args: "none", ignoreRestSiblings: true }],
    "@typescript-eslint/no-use-before-define": [2, { "functions": false }],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/tslint/config": [1, { lintFile: "./tslint.json" }],
  },
  plugins: ["@typescript-eslint/tslint"], // tslint integration is used for tslint-sonarts. Other rules should be handled by ESlint.
  settings: {
    react: {
      version: "latest", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
};
