// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  testEnvironment: "node",
  testPathIgnorePatterns: ["node_modules/"],
  roots: [
    "<rootDir>/src",
    "<rootDir>/example"
  ],
  testMatch: [
    "**/__tests__/**/*.+(ts)",
    "**/?(*.)+(spec|test).+(ts)"
  ],
  transform: {
    "^.+\\.(ts)$": "ts-jest"
  },
};
