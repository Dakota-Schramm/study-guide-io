import { ensureError, sitePath } from "@/lib/utils";
import { BaseProfessor, STEMProfessor } from "./professor";

type TeachingBoard = {
  stem: STEMProfessor;
};

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
      const err = ensureError(error);
      if (err.name === "AbortError") {
        return null;
      }

      console.log(`${err.name}: ${err.message}`);
      return null;
    }
  }
}

export { University };
