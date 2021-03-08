jest.mock('isomorphic-git');
import * as path from 'path';
import git from 'isomorphic-git';
import { Statuses } from '../../file/statuses';
import { describe, expect, it } from '@jest/globals';
import { promises as fs } from 'fs';
import { Template } from '../template';
import { FileParser } from '../../file/file-parser';

let templateFile;
let configFile;
const templatePath = './src/components/template/test/fixtures/stryker.conf.js';
const configPath = './src/components/template/test/fixtures/stryker-template.js';

describe('Template', () => {
  describe('#buildTemplate', () => {
    beforeEach(async () => {
      templateFile = await fs.readFile(templatePath, 'utf-8');
      const templateContent = `!!restOfConfig!!`;
      await fs.writeFile(templatePath, templateContent, 'utf-8');
      configFile = await fs.readFile(configPath, 'utf-8');
      const configContent = `module.exports = {
  mutate: [],
  plugins: ['@stryker-mutator/jest-runner'],
  testRunner: 'jest',
  jest: {
    configFile: './jestConfig.js',
  },
};`;
      await fs.writeFile(configPath, configContent, 'utf-8');
    });

    it('copies content from configFile to template only on restOfConfig regex', async () => {
      const expectedContent = `module.exports = {
  mutate: [],
  plugins: ['@stryker-mutator/jest-runner'],
  testRunner: 'jest',
  jest: {
    configFile: './jestConfig.js',
  },
};`;
      const statusRow = [
        ['src/my-file.ts', ...Statuses.modifiedStaged],
        ['src/my-file2.ts', ...Statuses.modifiedUnstaged],
        ['src/my-file3.ts', ...Statuses.unstagedDiffWorkDir],
      ];

      // @ts-ignore
      git.statusMatrix.mockReturnValue(statusRow);
      const fileParser = new FileParser();
      const modifiedFiles = await fileParser.retrieveFilenames();
      const template = new Template({ modifiedFiles, configFile });

      const file = await template.buildTemplate(configPath, templatePath);

      const fileContent = file.toString('utf-8');

      expect(fileContent).toBe(expectedContent);
    });

    it('copies content from configFile to template only on mutate property', async () => {
      const expectedContent = `module.exports = {
  mutate: ["src/template.ts","src/file.parser.ts","src/my-file3.ts"],
  plugins: ['@stryker-mutator/jest-runner'],
  testRunner: 'jest',
  jest: {
    configFile: './jestConfig.js',
  },
};`;
      const statusRow = [
        ['src/template.ts', ...Statuses.modifiedStaged],
        ['src/file.parser.ts', ...Statuses.modifiedUnstaged],
        ['src/my-file3.ts', ...Statuses.unstagedDiffWorkDir],
      ];

      // @ts-ignore
      git.statusMatrix.mockReturnValue(statusRow);
      const fileParser = new FileParser();
      const modifiedFiles = await fileParser.retrieveFilenames();
      const template = new Template({ modifiedFiles, configFile: configPath });

      await template.buildTemplate(configPath, templatePath);
      const regex = /[mutate: []]/g;
      const file = await template.buildTemplate(configPath, templatePath, { regex, modifiedFiles });
      const fileContent = file.toString('utf-8');

      expect(fileContent).toBe(expectedContent);
    });
  });

  describe('#createConfigFile', () => {
    let configFile;
    beforeEach(async () => {
      templateFile = await fs.readFile(templatePath, 'utf-8');
      const templateContent = `!!restOfConfig!!`;
      await fs.writeFile(templatePath, templateContent, 'utf-8');

      configFile = await fs.readFile(configPath, 'utf-8');
      const configContent = `module.exports = {
  mutate: [],
  plugins: ['@stryker-mutator/jest-runner'],
  testRunner: 'jest',
  jest: {
    configFile: './jestConfig.js',
  },
};`;
      await fs.writeFile(configPath, configContent, 'utf-8');
    });
    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue('./src/components/template/test/fixtures/');

    it('creates a config file with correct content', async () => {
      const expectedContent = `module.exports = {
  mutate: ["src/template.ts","src/file.parser.ts","src/my-file3.ts"],
  plugins: ['@stryker-mutator/jest-runner'],
  testRunner: 'jest',
  jest: {
    configFile: './jestConfig.js',
  },
};`;
      const statusRow = [
        ['src/template.ts', ...Statuses.modifiedStaged],
        ['src/file.parser.ts', ...Statuses.modifiedUnstaged],
        ['src/my-file3.ts', ...Statuses.unstagedDiffWorkDir],
      ];
      // @ts-ignore
      git.statusMatrix.mockReturnValue(statusRow);

      const fileParser = new FileParser();
      const modifiedFiles = await fileParser.retrieveFilenames();
      const template = new Template({ modifiedFiles, configFile: 'stryker.conf.js' });

      await template.createConfigFile();
      const file = await fs.readFile(path.resolve(process.cwd(), 'stryker.conf.js'), 'utf-8');

      expect(file).toBe(expectedContent);
    });
  });
});
