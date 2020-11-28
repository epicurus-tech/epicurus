export enum Head {
  absent,
  identical,
}

export enum WorkDir {
  absent,
  identical,
  diff,
}

export enum Stage {
  absent,
  identical,
  diff,
  diffWorkDir,
}

export const Statuses = {
  unmodified: [Head.identical, WorkDir.identical, Stage.identical],
  unstagedDelete: [Head.identical, WorkDir.absent, Stage.identical],
  stagedDelete: [Head.identical, WorkDir.absent, Stage.absent],
  modifiedStaged: [Head.identical, WorkDir.diff, Stage.identical],
  modifiedUnstaged: [Head.identical, WorkDir.diff, Stage.diff],
  unstagedDiffWorkDir: [Head.identical, WorkDir.identical, Stage.diffWorkDir],
  newFile: [Head.absent, WorkDir.diff, Stage.absent],
  newStaged: [Head.absent, WorkDir.diff, Stage.diff],
  newUnstagedDiffWorkDir: [Head.absent, WorkDir.diff, Stage.diffWorkDir],
};
