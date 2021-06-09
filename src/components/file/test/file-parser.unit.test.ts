jest.mock('isomorphic-git');
import git from 'isomorphic-git';
import { describe, expect, it } from '@jest/globals';
import { Statuses } from '../statuses';

import { FileParser } from '../file-parser';
describe('FileParser', () => {
  describe('#retrieveFilenames', () => {
    describe('when files have been modified since the last commit', () => {
      it('returns fileNames and filepath separates by commas', async () => {
        const expectedFiles = 'src/my-file.ts,src/my-file2.ts,src/my-file3.ts';
        const statusRow = [
          ['src/my-file.ts', ...Statuses.modifiedStaged],
          ['src/my-file2.ts', ...Statuses.modifiedUnstaged],
          ['src/my-file3.ts', ...Statuses.unstagedDiffWorkDir],
        ];

        // @ts-ignore
        git.statusMatrix.mockReturnValue(statusRow);
        const fileParser = new FileParser();
        const fileNames = await fileParser.retrieveFilenames();

        expect(fileNames).toStrictEqual(expectedFiles);
      });

      it('returns fileNames and filepath separates by new lines', async () => {
        const expectedFiles = 'src/my-file.ts\nsrc/my-file2.ts\nsrc/my-file3.ts';
        const statusRow = [
          ['src/my-file.ts', ...Statuses.modifiedStaged],
          ['src/my-file2.ts', ...Statuses.modifiedUnstaged],
          ['src/my-file3.ts', ...Statuses.unstagedDiffWorkDir],
        ];

        // @ts-ignore
        git.statusMatrix.mockReturnValue(statusRow);
        const fileParser = new FileParser({ format: '\n' });
        const fileNames = await fileParser.retrieveFilenames();

        expect(fileNames).toStrictEqual(expectedFiles);
      });
    });

    describe('when files is unmodified or deleted from last commit', () => {
      it('returns an empty string', async () => {
        const expectedFiles = '';
        const statusRow = [
          ['src/my-unmodified-file.ts', ...Statuses.unmodified],
          ['src/my-unstaged-delete-file.ts', ...Statuses.unstagedDelete],
          ['src/my-staged-delete-file.ts', ...Statuses.stagedDelete],
        ];

        // @ts-ignore
        git.statusMatrix.mockReturnValue(statusRow);
        const fileParser = new FileParser();
        const fileNames = await fileParser.retrieveFilenames();

        expect(fileNames).toStrictEqual(expectedFiles);
      });
    });
  });
});
