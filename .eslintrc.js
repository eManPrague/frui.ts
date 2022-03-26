module.exports = {
  root: true,
  extends: ["@emanprague/eslint-config/eslint-default"],
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "@typescript-eslint/unbound-method": "off", // we use @bound attribute
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
  },
  ignorePatterns: ["**/cra-template/template/**/*.ts", "**/cra-template/template/**/*.tsx"],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  overrides: [
    {
      files: ["**/*.test.ts"],
      rules: {
        "sonarjs/no-duplicate-string": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
      },
    },
  ],
};
