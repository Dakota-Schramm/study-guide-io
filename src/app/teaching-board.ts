import { STEMCourse } from "@/app/course";
import { BaseCourse } from "./course";
import { findSubDirectory, } from "../lib/fileHandleHelpers";
import { sitePath } from "@/lib/utils";

// TODO: Rename file to teaching-staff?

type findCourseHandleOptions = {
  create: boolean;
};

// TODO: Create two professors and keep track of in TeachingBoard class?
export class BaseProfessor {
  private root?: FileSystemDirectoryHandle | null;
  public handle?: FileSystemDirectoryHandle;
  public courses?: BaseCourse[];

  async initialize() {
    this.root = await this.setupHomeDirectory();
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

  // TODO: Add localStorage check for initialization
  /**
   * requires use of window
   * MUST BE a user action to work
   */
  private async setupHomeDirectory() {
    const fsdHandle = await this.requestDirectoryPermission();
    if (!fsdHandle) {
      return null;
    }

    let homeDir = fsdHandle;
    const isRootDirectoryAppDirectory = fsdHandle.name === sitePath;
    if (!isRootDirectoryAppDirectory) {
      homeDir = await fsdHandle.getDirectoryHandle(sitePath, {
        create: true,
      });
    }

    return homeDir;
  }

  /**
   * requires use of window
   * @returns a handle for the user selected directory or null
   */
  private async requestDirectoryPermission() {
    try {
      const fsdHandle = await window.showDirectoryPicker({
        mode: "readwrite",
        startIn: "documents",
      });

      return fsdHandle;
    } catch (error: unknown) {
      if (error.name === "AbortError") {
        return null;
      }

      console.log(`${typeof error}: ${error.message}`);
      return null;
    }
  }
}

class STEMProfessor extends BaseProfessor {
  public courses?: STEMCourse[];

  async initialize() {
    await super.initialize();
    const root = this.getRoot();
    if (root === null) return;

    const courseTypeHandle = await findSubDirectory(root, "STEM");
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
