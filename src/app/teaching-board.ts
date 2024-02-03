import { STEMCourse } from "@/app/course";
import { BaseCourse } from "./course";
import { findSubDirectory, setupHomeDirectory } from "./setUpApp";

type findCourseHandleOptions = {
  create: boolean;
};

// TODO: Create two professors and keep track of in TeachingBoard class?
export class BaseProfessor {
  private root?: FileSystemDirectoryHandle | null;
  public handle?: FileSystemDirectoryHandle;
  public courses?: BaseCourse[];

  async initialize() {
    this.root = await setupHomeDirectory();
  }

  public toString(): string {
    if (this.handle === undefined) return "BaseProfessor";
    return `${this.handle.name} Professor: ${
      this.courses?.length ?? 0
    } courses`;
  }

  public getRoot() {
    return this.root;
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
