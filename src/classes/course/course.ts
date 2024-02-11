import { CourseConfig } from "../config/course";

/*
  File structure that's generated will look like
  StudyGuideIO
  ├── STEM
  |   ├── Course1
  |   ├   ├── config.json 
  |   ├   ├── Exam1 
  |   ├   |   ├── File1
  |   ├   |   ├── File2
  |   ├── Course2
  |   ├   ├── config.json 
  |   ├   ├── Exam1 
  |   ├   |   ├── File1
  |   ├   |   ├── File2
  |-- Writing
  |   ├── Course1
  |   ├   ├── config.json 
  |   ├   ├── Exam1 
  |   ├   |   ├── File1
  |   ├   |   ├── File2

*/

/* 
  TODO: Add the following features:
    - Add course end date
  Save the settings for these features within a JSON file
*/
export class Course {
  static _id = 0;
  public id: number;
  private _type?: "STEM";
  private courseHandle?: FileSystemDirectoryHandle;
  private config?: CourseConfig;
  protected _files?: FileSystemFileHandle[];

  public constructor(
    courseHandle: FileSystemDirectoryHandle,
    type: "STEM" = "STEM",
  ) {
    this.id = Course._id++;
    this.courseHandle = courseHandle;
    this._type = type;
  }

  async initialize() {
    if (!this.courseHandle) {
      window.log.warn("CourseHandle not found");
      return;
    }

    window.log.debug(`Setting up course for ${this.getName()}...`);
    const config = new CourseConfig(this.courseHandle);
    await config.initialize();

    const files = (await Array.fromAsync(this.courseHandle.values())).filter(
      (handle) => handle.kind === "file",
    );

    this.config = config;
    this.files = files;
  }

  public getName(): string | undefined {
    return this.courseHandle?.name;
  }

  public toString(): string {
    return `${this.getName() ?? "Course"} with ${
      this?.files?.length ?? 0
    } files`;
  }

  get files(): FileSystemFileHandle[] | undefined {
    return this._files;
  }

  set files(files: FileSystemFileHandle[]) {
    this._files = files;
  }

  get type(): "STEM" | undefined {
    return this._type;
  }

  public getCourseFiles() {
    if (!this.files) return [];

    const courseFiles = this.files?.filter((f) => {
      const isSettingsFile = ["config.json"].includes(f.name);

      return !isSettingsFile;
    });

    return courseFiles;
  }

  public changeConfigFile(kvPairs: [string, string][]) {
    this.config?.write(kvPairs);
  }

  /**
   * Creates a new array of files to add to the config's "exams" key
   * @param filesToAssign
   * @returns
   */
  public async assignFilesToExam(filesToAssign: string[]) {
    const courseFiles = this.files;
    if (!courseFiles) return;

    const selectedFiles = courseFiles.filter((f) =>
      filesToAssign.includes(f.name),
    );
    const selectedFilesNames = selectedFiles.map((f) => f.name);

    const configObj = await this.config?.read();
    configObj.exams = (configObj.exams || []).concat([selectedFilesNames]);

    await this.config?.replace(configObj);
  }

  public async getExams() {
    const jsonObj = await this.config?.read();
    const allExams = jsonObj.exams as string[][];

    return allExams;
  }

  public async deleteExam(idxToDelete: number): Promise<string[][]> {
    const jsonObj = await this.config?.read();
    const allExams = jsonObj.exams;

    const examsWithoutDeletedExam = allExams.filter(
      (_, idx) => idx !== idxToDelete,
    );
    jsonObj.exams = examsWithoutDeletedExam;

    await this.config?.replace(jsonObj);
    return examsWithoutDeletedExam;
  }
}
