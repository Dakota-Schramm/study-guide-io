import { STEMCourse } from "@/app/course";
import { BaseCourse } from "./course";
import { ensureError } from "@/lib/utils";

// TODO: Rename file to teaching-staff?

type findCourseHandleOptions = {
  create: boolean;
};

// TODO: Create two professors and keep track of in TeachingBoard class?
export class BaseProfessor {
  private root?: Nullable<FileSystemDirectoryHandle>;
  public handle?: FileSystemDirectoryHandle;
  public courses?: BaseCourse[];

  constructor(root: FileSystemDirectoryHandle | null) {
    this.root = root;
  }

  async initialize<C extends BaseCourse>(
    type: Course,
    courseConstructor: new (...args: FileSystemDirectoryHandle[]) => C,
  ) {
    this.handle = await this.getCourseTypeHandle(type);
    this.courses = await this.collectAndInitializeCourses(courseConstructor);
  }

  public getRoot(): Nullable<FileSystemDirectoryHandle> {
    return this.root;
  }

  public toString(): string {
    if (this.handle === undefined) return "BaseProfessor";
    return `${this.handle.name} Professor: ${
      this.courses?.length ?? 0
    } courses`;
  }

  /**
   * Change the course's config.json
   */
  public adjustSyllabus(courseName: string, kvPairs: [string, string][]): void {
    const course = this.courses?.find((c) => c.getName() === courseName);
    if (!course) return;
    course.changeConfigFile(kvPairs);
  }

  /**
   * Seems like this isn't needed???
   * @param create whether the directory should be created if not found
   * @returns the FileSystemDirectoryHandle if create is true or if the directory exists, null otherwise
   */
  public async findCourseHandle(
    courseName: string,
    options: findCourseHandleOptions = { create: false },
  ): Promise<FileSystemDirectoryHandle | undefined> {
    let found: FileSystemDirectoryHandle | undefined;
    if (!this.handle) return found;

    const { create } = options;

    for await (const [fileName, fileObj] of this.handle.entries()) {
      if (fileName === courseName) {
        found = fileObj;
      }
    }

    if (!found && create) {
      found = await this.handle.getDirectoryHandle(courseName, { create });
    }

    return found;
  }

  private async getCourseTypeHandle(type: Course) {
    if (this.root === null || this.root === undefined) {
      return;
    }

    let courseTypeHandle: FileSystemDirectoryHandle | undefined;
    try {
      courseTypeHandle = await this.root.getDirectoryHandle(type, {
        create: true,
      });
    } catch (error: unknown) {
      const err = ensureError(error);

      if (err.name === "NotAllowedError") {
        alert("You need to allow readwrite access to the root directory");
      }
      console.log(`${err.name}" ${err.message}`);
    }

    return courseTypeHandle;
  }

  private async collectAndInitializeCourses(
    courseConstructor: new (...args: FileSystemDirectoryHandle[]) => C,
  ) {
    const courseFiles = await Array.fromAsync(this.handle.entries());
    const coursePromises = courseFiles.map(async ([_, courseFileHandle]) => {
      if (courseFileHandle.kind !== "directory") {
        console.log({ courseFileHandle });
        return;
      }
      const course = new courseConstructor(courseFileHandle);
      await course.initialize(this.root);

      return course;
    });

    const courses = await Promise.all(coursePromises);
    console.log({ courses });
    return courses.filter((course) => course !== undefined);
  }
}

class STEMProfessor extends BaseProfessor {
  async initialize() {
    await super.initialize("STEM", STEMCourse);
  }
}

export { STEMProfessor };
