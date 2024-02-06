import { ensureError, sitePath } from "@/lib/utils";

type UserFileSystemHandles = {
  [key: string]: Nullable<FileSystemDirectoryHandle>;
};

export class FullAccessUserConfig {
  private handles?: UserFileSystemHandles;

  async initialize() {
    const handles = {
      root: await this.setupHomeDirectory(),
    };

    for await (const [name, handle] of handles.root?.values()) {
      handles[name] = handle;
    }

    this.handles = handles;
  }

  public getRoot(): Nullable<FileSystemDirectoryHandle> {
    return this.handles?.root;
  }

  public getCourseTypeHandles(): [string, FileSystemDirectoryHandle[]] | null {
    if (!this.handles) return null;

    return Object.entries(this.handles).filter(([k]) => k !== "root");
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
