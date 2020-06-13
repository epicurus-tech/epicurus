jest.mock('isomorphic-git');
import git from 'isomorphic-git';
import {describe, expect, it } from '@jest/globals'

import { FileParser } from './file-parser';
describe('FileParser', () => {
    describe('#retrieveFilenames', () => {
       describe('when files have been modified since the last commit', () => {
           it('returns fileNames and filepath', async () => {
               const HEAD = 1, WORKDIR = 2, STAGE = 1;
               const statusRow = [['src/my-file.js', HEAD, WORKDIR, STAGE]];
               // @ts-ignore
               git.statusMatrix.mockReturnValue(statusRow);
              const fileParser = new FileParser();
              const fileNames = await fileParser.retrieveFilenames();

              expect(fileNames).toStrictEqual(['src/my-file.js']);
           });
       })
   });
});
