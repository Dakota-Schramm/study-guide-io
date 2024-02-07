import { ensureError, sitePath } from "@/lib/utils";

type UserFileSystemHandles = {
  [key: string]: Nullable<FileSystemDirectoryHandle>;
};

type findCourseHandleOptions = {
  create: boolean;
};

export class FullAccessUserConfig {
  private handles?: UserFileSystemHandles;

  async initialize() {
    const root = await this.setupHomeDirectory();

    const handles = { root };
    await this.setupHandles(handles);

    this.handles = handles;
  }

  public getRoot(): Nullable<FileSystemDirectoryHandle> {
    return this.handles?.root;
  }

  public getCourseTypeHandles(): [string, FileSystemDirectoryHandle[]] {
    if (!this.handles) {
      throw new Error("Handles not initialized");
    }

    return Object.entries(this.handles).filter(([k]) => k !== "root");
  }

  // TODO: Make private
  /**
   * @param create whether the directory should be created if not found
   * @returns the FileSystemDirectoryHandle if create is true or if the directory exists, null otherwise
   */
  public async findCourseHandle(
    courseType: Course,
    courseName: string,
    options: findCourseHandleOptions = { create: false },
  ): Promise<FileSystemDirectoryHandle> {
    const { create } = options;

    let found;
    const courseTypeHandle = this.getCourseTypeHandles().find(
      ([k, v]) => k === courseType,
    )?.[1] as FileSystemDirectoryHandle;

    if (!courseTypeHandle) {
      throw new Error("Course type directories not initialized");
    }

    let courseHandle = Array.fromAsync(courseTypeHandle?.entries() ?? []).find(
      ([k, v]) => k === courseName,
    )?.[1];

    if (!courseHandle && create) {
      courseHandle = courseTypeHandle.getDirectoryHandle(courseName, {
        create,
      });
    }

    return courseHandle;
  }

  /**
   *
   * @param handles
   * modifies the Object passed to the function
   */
  private async setupHandles(handles: UserFileSystemHandles): Promise<void> {
    const root = handles.root;
    if (!root) throw new Error("handles.root not initialized yet");

    try {
      for await (const courseType of ["STEM"]) {
        handles[courseType] = await root.getDirectoryHandle(courseType, {
          create: true,
        });
      }
    } catch (error: unknown) {
      const err = ensureError(error);

      if (err.name === "NotAllowedError") {
        alert("You need to allow readwrite access to the root directory");
      }
      console.log(`${err.name}" ${err.message}`);
    }
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
      const err = ensureError(error);
      if (err.name === "AbortError") {
        return null;
      }

      console.log(`${err.name}: ${err.message}`);
      return null;
    }
  }
}
