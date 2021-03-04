module.exports = {
  mutate: [
    'src/components/template/template.ts',
    'src/components/template/test/fixtures/stryker-template.js',
    'src/components/template/test/template.unit.test.ts',
  ],
  jest: {
    enableFindRelatedTests: true,
  },
};
