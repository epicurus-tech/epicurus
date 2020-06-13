import git from 'isomorphic-git';
import * as path from 'path';
import * as fs from 'fs';

export class FileParser {
    private readonly dirDepth: string;
    constructor(dirDepth = '../../') {
      this.dirDepth = dirDepth;
    }

    async retrieveFilenames() {
        const FILE = 0, HEAD = 1, WORKDIR = 2;
        const dir: string = path.resolve(`${__dirname}`, this.dirDepth);
        const files = await git.statusMatrix({
           dir,
           fs,
           filter: row => row[HEAD] !== row[WORKDIR]
        });
        return files.map(f => f[FILE]);
    }
}
