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
import { CourseConfig } from "./config/course";

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
  private config?: CourseConfig;

  public constructor(courseHandle: FileSystemDirectoryHandle) {
    // name cannot be changed after this initial definition, which has to be either at it's declaration or in the constructor.
    this.id = BaseCourse._id++;
    this.courseHandle = courseHandle;
  }

  async initialize(appHandle: FileSystemDirectoryHandle, courseType: Course) {
    const courseTypeHandle = await findSubDirectory(appHandle, courseType);
    const courseHandle = await courseTypeHandle?.getDirectoryHandle(
      this.getName(),
      { create: true },
    );

    if (!courseHandle) {
      window.log.warn("CourseHandle not found");
      return;
    }

    window.log.debug(`Setting up course for ${courseHandle.name}...`);
    const config = new CourseConfig(courseHandle);
    await config.initialize();

    const files = (await Array.fromAsync(this.courseHandle.values())).filter(
      (handle) => handle.kind === "file",
    );

    this.courseHandle = courseHandle;
    this.config = config;
    this.files = files;
  }

  public toString(): string {
    return `${this.getName() ?? "Course"} with ${
      this?.files?.length ?? 0
    } files`;
  }

  public getName(): string | undefined {
    return this.courseHandle?.name;
  }

  public getFiles(): FileSystemFileHandle[] | undefined {
    return this.files;
  }

  public setFiles(files: FileSystemFileHandle[]): void {
    this.files = files;
  }
}

class STEMCourse extends BaseCourse {
  async initialize(appHandle: FileSystemDirectoryHandle) {
    await super.initialize(appHandle, "STEM");
  }
}

export { STEMCourse };
