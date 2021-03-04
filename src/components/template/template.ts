import { promises as fs } from 'fs';
import * as path from 'path';
import { Files } from '../file/file-parser';

export class Template {
  private readonly _modifiedFiles: Files[];
  private readonly _configFile: string;
  constructor({ modifiedFiles, configFile }: { modifiedFiles: Files[]; configFile: string }) {
    this._modifiedFiles = modifiedFiles;
    this._configFile = configFile;
  }

  async buildTemplate(
    configFile: string,
    templateFile: string,
    { regex = /!!restOfConfig!!/g, modifiedFiles }: { regex?: RegExp; modifiedFiles?: Files[] } = {}
  ): Promise<Buffer> {
    let readFile;
    let buildFile;
    try {
      readFile = await fs.readFile(configFile, 'utf-8');
      const template = await fs.readFile(templateFile, 'utf-8');
      if (!modifiedFiles) {
        buildFile = template.replace(regex, readFile);
      } else {
        buildFile = template.replace(regex, JSON.stringify(modifiedFiles));
      }
    } catch (err) {
      console.log(err);
    }
    await fs.writeFile(templateFile, buildFile);
    return fs.readFile(templateFile);
  }

  async createConfigFile() {
    const pathConfigFile = path.resolve(process.cwd(), this._configFile);
    const template = path.resolve(process.cwd(), 'stryker-template.js');
    await this.buildTemplate(pathConfigFile, template);
    const file = await this.buildTemplate(pathConfigFile, template, {
      regex: /[mutate:[]]/gm,
      modifiedFiles: this._modifiedFiles,
    });
    await fs.writeFile(pathConfigFile, file);
  }
}
