import git from 'isomorphic-git'
import * as path from 'path'
import * as fs from 'fs'
import { Statuses } from './statuses'

export interface Files {
  path: string
}

type FormattedFiles = string

export class FileParser {
  private readonly dirPath: string
  private readonly dir: string
  private readonly format: string

  constructor({ dirDepth = '../../../', dir = 'src', format = ',' } = {}) {
    this.dirPath = path.resolve(`${__dirname}`, dirDepth)
    this.dir = dir
    this.format = format
  }

  async retrieveFilenames(): Promise<FormattedFiles> {
    const FILE = 0
    const HEAD = 1
    const WORKDIR = 2
    const STAGE = 3
    const statusFiles = await this.getFilesFromDir(this.dir)

    const files = this.mapFileStatus({
      statusFiles,
      FILE,
      HEAD,
      WORKDIR,
      STAGE
    })

    return this.filterFiles(files)
  }

  private mapFileStatus({
    statusFiles,
    FILE,
    HEAD,
    WORKDIR,
    STAGE
  }: {
    statusFiles
    FILE: number
    HEAD: number
    WORKDIR: number
    STAGE: number
  }) {
    return statusFiles.map((statusFile) => ({
      path: statusFile[FILE],
      status: [statusFile[HEAD], statusFile[WORKDIR], statusFile[STAGE]]
    }))
  }

  private async getFilesFromDir(dir: string) {
    return git.statusMatrix({
      dir: this.dirPath,
      fs,
      filter: (f) => f.startsWith(dir)
    })
  }

  private filterFiles(files): FormattedFiles {
    const unmodifiedFiles = this.filterUnmodifiedFiles(files)
    const modifiedFiles = this.filterModifiedFiles(files)

    return [...unmodifiedFiles, ...modifiedFiles].join(this.format)
  }

  private filterUnmodifiedFiles(files): Files[] {
    const { unmodified, stagedDelete, unstagedDelete } = Statuses
    return files
      .filter(
        (file) =>
          unmodified.every((unmodified) => this.hasUnmodifiedFiles(unmodified, file.status)) ||
          stagedDelete.every((stagedDelete) => this.hasUnmodifiedFiles(stagedDelete, file.status)) ||
          unstagedDelete.every((unstagedDelete) => this.hasUnmodifiedFiles(unstagedDelete, file.status))
      )
      .map((file) => file.path)
  }

  private filterModifiedFiles(files): Files[] {
    const { modifiedStaged, modifiedUnstaged, unstagedDiffWorkDir, newFile, newStaged, newUnstagedDiffWorkDir } =
      Statuses

    return files
      .filter(
        (file) =>
          modifiedStaged.every((modified) => !this.hasUnmodifiedFiles(modified, file.status)) ||
          modifiedUnstaged.every((modifiedStaged) => !this.hasUnmodifiedFiles(modifiedStaged, file.status)) ||
          unstagedDiffWorkDir.every((unstaged) => !this.hasUnmodifiedFiles(unstaged, file.status)) ||
          newFile.every((newFile) => !this.hasUnmodifiedFiles(newFile, file.status)) ||
          newStaged.every((newStaged) => !this.hasUnmodifiedFiles(newStaged, file.status)) ||
          newUnstagedDiffWorkDir.every((newUnstaged) => !this.hasUnmodifiedFiles(newUnstaged, file.status))
      )
      .map((file) => file.path)
  }

  private hasUnmodifiedFiles = (currentStatus, fileStatus) =>
    fileStatus.every((fileStatus) => fileStatus !== currentStatus)
}
