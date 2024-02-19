import { ensureError } from "@/lib/utils";
// TODO: Implement base class for Full Access and Restricted users

type FindCourseHandleOptions = {
  create: boolean;
};

type UserFileSystemHandles = {
  [key: string]: Nullable<FileSystemDirectoryHandle>;
};

export abstract class BaseUserConfig {
  protected handles?: UserFileSystemHandles;
  protected _permitted?: boolean;

  async initialize(root: FileSystemDirectoryHandle) {
    if (!root) {
      this.permitted = false;
      return;
    }
    const handles = { root };

    try {
      for await (const courseType of ["STEM"]) {
        handles[courseType] = await root.getDirectoryHandle(courseType, {
          create: true,
        });
      }
    } catch (error: unknown) {
      const err = ensureError(error);

      window.log.error(`${err.name}" ${err.message}`);
    }

    this.handles = handles;
    this.permitted = true;
  }

  public getRoot(): Nullable<FileSystemDirectoryHandle> {
    return this.handles?.root;
  }

  get permitted(): boolean | undefined {
    return this._permitted;
  }

  set permitted(newValue: boolean) {
    this._permitted = newValue;
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
    options: FindCourseHandleOptions = { create: false },
  ): Promise<FileSystemDirectoryHandle> {
    const { create } = options;

    const courseTypeHandle = this.getCourseTypeHandles().find(
      ([k, v]) => k === courseType,
    )?.[1] as FileSystemDirectoryHandle;

    if (!courseTypeHandle) {
      throw new Error("Course type directories not initialized");
    }

    let courseHandle = (
      await Array.fromAsync(courseTypeHandle?.entries() ?? [])
    ).find(([k, v]) => k === courseName)?.[1];

    if (!courseHandle && create) {
      courseHandle = courseTypeHandle.getDirectoryHandle(courseName, {
        create,
      });
    }

    return courseHandle;
  }
}
