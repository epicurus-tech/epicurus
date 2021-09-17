#!/usr/bin/env node
import { Command } from 'commander';
const program = new Command();
import { FileParser } from './components/file/file-parser';

const parsedFiles = (): Promise<string> => {
  const parser = new FileParser({
    dir: program.opts().dir,
    format: program.opts().separator,
    dirDepth: program.opts().dirDepth,
  });
  return parser.retrieveFilenames();
};

(async () => {
  program
    .version('0.0.1', '-v')
    .option('-d, --dir <directory>', 'Choose a directory to watch for diff')
    .option('-s, --separator <separator>', 'Define the separator')
    .option('-D, --dirDepth <dirDepth>', 'Define the depth of the directory')
    .action(async () => console.log(await parsedFiles()))
    .parse();
})();
