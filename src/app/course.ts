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

import { findSubDirectory } from "../lib/fileHandleHelpers";

const exampleCourseConfig = {
  foo: "bar",
};

/* 
  TODO: Add the following features:
    - Add course end date
  Save the settings for these features within a JSON file
*/
export class BaseCourse {
  static _id = 0;
  public id: number;
  private courseHandle?: FileSystemDirectoryHandle;
  private files?: FileSystemFileHandle[];
  private readonly name: string;

  public constructor(courseHandle: FileSystemDirectoryHandle) {
    // name cannot be changed after this initial definition, which has to be either at it's declaration or in the constructor.
    this.id = BaseCourse._id++;
    this.courseHandle = courseHandle;
    this.name = courseHandle.name;
  }

  async initialize(appHandle: FileSystemDirectoryHandle, courseType: Course) {
    const courseTypeHandle = await findSubDirectory(appHandle, courseType);
    const courseHandle = await courseTypeHandle?.getDirectoryHandle(this.name, {
      create: true,
    });

    if (courseHandle) {
      await this.setupCourseConfig(courseHandle);
    }

    this.courseHandle = courseHandle;
  }

  public getName(): string {
    return this.name;
  }

  public getFiles(): FileSystemFileHandle[] | undefined {
    return this.files;
  }

  public setFiles(files: FileSystemFileHandle[]): void {
    this.files = files;
  }

  private async setupCourseConfig(
    handle: FileSystemDirectoryHandle,
  ): Promise<void> {
    const configHandle = await handle.getFileHandle("config.txt", {
      create: true,
    });
    const writable = await configHandle.createWritable();

    // Write the contents of the file to the stream.
    await writable.write('{ foo: "bar" }');

    // Close the file and write the contents to disk.
    await writable.close();
  }
}

class STEMCourse extends BaseCourse {
  async initialize(appHandle: FileSystemDirectoryHandle, courseName: string) {
    await super.initialize(appHandle, "STEM");
  }
}

export { STEMCourse };
