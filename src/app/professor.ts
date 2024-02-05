import { STEMCourse } from "@/app/course";
import { BaseCourse } from "./course";
import { findSubDirectory, } from "../lib/fileHandleHelpers";

// TODO: Rename file to teaching-staff?

type findCourseHandleOptions = {
  create: boolean;
};

// TODO: Create two professors and keep track of in TeachingBoard class?
export class BaseProfessor {
  private root?: FileSystemDirectoryHandle | null;
  public handle?: FileSystemDirectoryHandle;
  public courses?: BaseCourse[];

  constructor(root: FileSystemDirectoryHandle | null) {
    this.root = root;
  }

  async initialize(
    type: "STEM",
    courseConstructor: new (...args) => BaseCourse,
  ) {
    const root = this.getRoot();
    if (root === null) return;

    let courseTypeHandle: FileSystemDirectoryHandle | undefined;
    try {
      courseTypeHandle = await root?.getDirectoryHandle(type, {
        create: true,
      });
    } catch (error: unknown) {
      if (!(error instanceof Error)) return;

      if (error.name === "NotAllowedError") {
        alert("You need to allow readwrite access to the root directory");
      }
      console.log(`${error.name}" ${error.message}`);
    }

    this.handle = courseTypeHandle;
    if (courseTypeHandle) {
      this.courses = await this.instantiateCourses(
        courseTypeHandle,
        courseConstructor,
      );
    }
  }

  public getRoot(): FileSystemDirectoryHandle | null | undefined {
    return this.root;
  }

  public toString(): string {
    if (this.handle === undefined) return "BaseProfessor";
    return `${this.handle.name} Professor: ${
      this.courses?.length ?? 0
    } courses`;
  }

  /**
   *
   * @param create whether the directory should be created if not found
   * @returns the FileSystemDirectoryHandle if create is true or if the directory exists, null otherwise
   */
  public async findCourseHandle(
    courseName: string,
    options: findCourseHandleOptions = { create: false },
  ): Promise<FileSystemDirectoryHandle | null> {
    let found = null;
    if (!this.handle) return found;

    const { create } = options;

    for await (const [fileName, fileObj] of this.handle.entries()) {
      if (fileName === courseName) {
        found = fileObj;
      }
    }

    if (!found && create) {
      found = this.handle.getDirectoryHandle(courseName, { create });
    }

    return found;
  }

  /**
   * Creates all courses for the current user
   */
  public async instantiateCourses<Course extends BaseCourse>(
    courseTypeDirectory: FileSystemDirectoryHandle,
    courseConstructor: new (...args) => Course,
  ): Promise<Course[]> {
    const courses = [];

    for await (const directoryHandle of courseTypeDirectory.values()) {
      if (directoryHandle.kind !== "directory") continue;

      const newCourse = await this.instantiateCourse(
        directoryHandle,
        courseConstructor,
      );
      await newCourse.initialize(this.handle, "stem");
      courses.push(newCourse);
    }

    return courses;
  }

  private async instantiateCourse<Course extends BaseCourse>(
    courseHandle: FileSystemDirectoryHandle,
    courseConstructor: new (...args) => Course,
  ): Promise<Course> {
    const newCourse = new courseConstructor(courseHandle);

    const files = (await Array.fromAsync(courseHandle.values())).filter(
      (handle) => handle.kind === "file",
    );

    newCourse.setFiles(files);

    return newCourse;
  }
}

class STEMProfessor extends BaseProfessor {
  public courses?: STEMCourse[];

  async initialize() {
    await super.initialize("STEM", STEMCourse);
  }
}

export { STEMProfessor };
