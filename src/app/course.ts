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

import { findSubDirectory } from "./fileHandleUtils";

/* 
  TODO: Add the following features:
    - Add course end date
*/
export class BaseCourse {
  private courseHandle?: FileSystemDirectoryHandle;
  private files?: FileSystemFileHandle[];
  private readonly name: string;

  public constructor(courseHandle: FileSystemDirectoryHandle) {
    // name cannot be changed after this initial definition, which has to be either at it's declaration or in the constructor.
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

  public getHandle(): FileSystemDirectoryHandle | undefined {
    return this.courseHandle;
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
