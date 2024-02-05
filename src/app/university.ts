import { sitePath } from "@/lib/utils";

class University {
  private root?: FileSystemDirectoryHandle | null;

  async initialize() {
    this.root = await this.setupHomeDirectory();
  }

  public getRoot() {
    return this.root;
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

export { University };
