jest.mock('isomorphic-git');
import git from 'isomorphic-git';
import {describe, expect, it } from '@jest/globals'

import { FileParser } from './file-parser';
describe('FileParser', () => {
    describe('#retrieveFilenames', () => {
       describe('when files have been modified since the last commit', () => {
           it('returns fileNames and filepath', async () => {
               const expectedFiles = [
                 'src/my-file.ts',
                 'src/my-file2.ts',
                 'src/my-file3.ts',
               ]
               const statusRow = [
                 ['src/my-file.ts',  1, 2, 1],
                 ['src/my-file2.ts', 1, 2, 2],
                 ['src/my-file3.ts', 1, 2, 3],
               ];

              // @ts-ignore
              git.statusMatrix.mockReturnValue(statusRow);
              const fileParser = new FileParser();
              const fileNames = await fileParser.retrieveFilenames();

              expect(expectedFiles).toStrictEqual(fileNames);
           });
       })
   });
});
