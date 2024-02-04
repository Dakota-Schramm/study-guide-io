/*
  File structure that's generated will look like
  StudyGuideIO
  ├── STEM
  |   ├── Course1
  |   ├   ├── File1
  |   ├   ├── File2
  |   ├── Course2
  |   ├   ├── File1
  |   ├   ├── File2
  |-- Writing
  |   ├── Course1
  |   ├── Course2

*/

import { findSubDirectory } from "./fileHandleHelpers";

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

  async initialize(
    appHandle: FileSystemDirectoryHandle,
    courseType: "stem" | "writing",
  ) {
    const courseTypeHandle = await findSubDirectory(appHandle, courseType);
    const courseHandle = await courseTypeHandle?.getDirectoryHandle(this.name, {
      create: true,
    });

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
}

class STEMCourse extends BaseCourse {
  async initialize(appHandle: FileSystemDirectoryHandle, courseName: string) {
    await super.initialize(appHandle, "stem");
  }
}

export { STEMCourse };
