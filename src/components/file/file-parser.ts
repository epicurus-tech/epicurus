/* tslint:disable */
import git from 'isomorphic-git';
import * as path from 'path';
import * as fs from 'fs';
import { Statuses } from './statuses';

interface Files {
  path: string;
}

export class FileParser {
    private readonly dirDepth: string;
    constructor(dirDepth = '../../../') {
      this.dirDepth = dirDepth;
    }

    async retrieveFilenames(): Promise<string[]> {
     const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3;
     const dir: string = path.resolve(`${__dirname}`, this.dirDepth);

     // Get all files from specific directory
     const statusFiles = await git.statusMatrix({
       dir,
       fs,
       filter: f => f.startsWith('src')
     });

     // mapFiles to desired object
     const files = statusFiles.map(statusFile => ({
        path: statusFile[FILE],
        status: [
            statusFile[HEAD] ,
            statusFile[WORKDIR],
            statusFile[STAGE],
          ]
     }));
     return this.filterModifiedFiles(files)
       .map(file => file.path)
    }

private filterModifiedFiles(files): Files[] {
  const { unmodified, stagedDelete, unstagedDelete } = Statuses;
  return files.filter(file =>
      !unmodified.includes(file.status) ||
      !stagedDelete.includes(file.status) ||
      !unstagedDelete.includes(file.status));
  }
}
