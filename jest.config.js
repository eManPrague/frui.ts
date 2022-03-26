/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  modulePathIgnorePatterns: ["mocks/", "testHelpers"],
  moduleNameMapper: {
    "^lodash-es$": "lodash",
  },
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.jest.json",
    },
  },
};
