module.exports = {
  mutate: ['./example/components/domain/domain.js'],
  mutator: "javascript",
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress", "dashboard"],
  testRunner: "mocha",
  transpilers: [],
  testFramework: "mocha",
  coverageAnalysis: "perTest",
};
