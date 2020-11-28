import { FileParser } from './components/file/file-parser';

(async function main() {
  const parser = new FileParser();
  console.log(await parser.retrieveFilenames());
})();
