import { STEMCourse } from "@/app/course";
import { BaseCourse } from "./course";
import { findSubDirectory, setupHomeDirectory } from "./setUpApp";

// TODO: Create two professors and keep track of in TeachingBoard class?
export class BaseProfessor {
  private root?: FileSystemDirectoryHandle;
  public handle?: FileSystemDirectoryHandle;
  public courses?: BaseCourse[];

  async initialize() {
    this.root = await setupHomeDirectory();
  }

  public getRoot() {
    return this.root;
  }

  public async findCourseHandle(
    courseName: string,
  ): Promise<FileSystemDirectoryHandle | null> {
    let found = null;
    if (!this.handle) return found;

    for await (const subdirectory of this.handle.entries()) {
      const [fileName, fileObj] = subdirectory;
      if (fileName === courseName) found = fileObj;
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
    await super.initialize();
    const courseTypeHandle = await findSubDirectory(this.root, "STEM");
    if (courseTypeHandle === null) {
      throw new Error(
        "STEMProfessor.initialize() => " + "STEM directory could not be found",
      );
    }

    this.handle = courseTypeHandle;
    this.courses = await super.instantiateCourses(courseTypeHandle, STEMCourse);
  }
}

export { STEMProfessor };
