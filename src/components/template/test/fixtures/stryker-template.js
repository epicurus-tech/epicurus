module.exports = {
  mutate: ['src/template.ts', 'src/file.parser.ts', 'src/my-file3.ts'],
  plugins: ['@stryker-mutator/jest-runner'],
  testRunner: 'jest',
  jest: {
    configFile: './jestConfig.js',
  },
};
