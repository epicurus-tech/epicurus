import { FileParser } from './components/file/file-parser';

(async function main() {
  const parser = new FileParser();
  const modifiedFiles = await parser.retrieveFilenames();
  console.log(modifiedFiles);
})();
