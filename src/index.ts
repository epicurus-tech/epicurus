import { FileParser } from './components/file/file-parser';
import { Template } from './components/template/template';

(async function main() {
  const parser = new FileParser();
  const modifiedFiles = await parser.retrieveFilenames();
  console.log(modifiedFiles);
  const buildTemplate = new Template({ modifiedFiles, configFile: 'stryker.conf.js' });
  await buildTemplate.createConfigFile();
})();
