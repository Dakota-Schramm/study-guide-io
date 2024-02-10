export abstract class BaseCourse {
  static _id = 0;
  public id: number;
  protected _files?: FileSystemFileHandle[];

  public constructor() {
    this.id = BaseCourse._id++;
  }

  abstract initialize(
    appHandle: FileSystemDirectoryHandle,
    courseType: Course,
  ): void;

  abstract getName(): string | undefined;

  get files(): FileSystemFileHandle[] | undefined {
    return this._files;
  }

  set files(files: FileSystemFileHandle[]) {
    this._files = files;
  }

  abstract changeConfigFile(kvPairs: [string, string][]): void;

  /**
   * Creates a new array of files to add to the config's "exams" key
   * @param filesToAssign
   * @returns
   */
  abstract assignFilesToExam(filesToAssign: string[]): void;

  abstract getExams(): Promise<string[][]>;
  abstract deleteExam(idxToDelete: number): Promise<string[][]>;
}
