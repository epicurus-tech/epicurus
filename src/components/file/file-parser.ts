/* tslint:disable */
import git from 'isomorphic-git';
import * as path from 'path';
import * as fs from 'fs';
import { Statuses } from './statuses';

interface Files {
  path: string;
}

export class FileParser {
    private readonly dirPath: string;
    private readonly dir: string;

    constructor(dirDepth = '../../../', dir= 'src') {
      this.dirPath = path.resolve(`${__dirname}`, dirDepth);
      this.dir = dir;
    }

    async retrieveFilenames(): Promise<string[]> {
     const FILE = 0, HEAD = 1, WORKDIR = 2, STAGE = 3;
     const statusFiles = await this.getFilesFromDir(this.dir);

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

  private async getFilesFromDir(dir: string) {
    return git.statusMatrix({
      dir: this.dirPath,
      fs,
      filter: f => f.startsWith(dir)
    });
  }

  private filterModifiedFiles(files): Files[] {
  const { unmodified, stagedDelete, unstagedDelete } = Statuses;
  const oi = files.filter(file =>
      !unmodified.every(unmodified => this.hasUnmodifiedFiles(unmodified, file.status))
      && !stagedDelete.every(stagedDelete => this.hasUnmodifiedFiles(stagedDelete, file.status))
      && !unstagedDelete.every(unstagedDelete => this.hasUnmodifiedFiles(unstagedDelete, file.status)));
  return oi;
  }

  private hasUnmodifiedFiles = (currentStatus, fileStatus) => fileStatus.includes(currentStatus);
}
