module.exports = {
  extends: ["@emanprague/eslint-config/eslint-default"],
  rules: {
    "@typescript-eslint/no-use-before-define": [2, { functions: false }],
  },
  settings: {
    react: {
      version: "latest",
    },
  },
};
