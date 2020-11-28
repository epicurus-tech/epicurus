module.exports = {
  mutate: ['./example/components/domain/domain.ts'],
  mutator: 'typescript',
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress', 'dashboard'],
  testRunner: 'jest',
  transpilers: ['typescript'],
  testFramework: 'jest',
  coverageAnalysis: 'off',
  tsconfigFile: 'tsconfig.json',
  jest: {
    enableFindRelatedTests: true,
  },
};
