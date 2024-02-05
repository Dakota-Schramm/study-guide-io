import { ensureError, sitePath } from "@/lib/utils";
import { BaseProfessor, STEMProfessor } from "./professor";

type TeachingBoard = {
  stem: STEMProfessor;
};

//? Maybe drop this class, since only one will be created? Move to hooks?
//? ==> Only use classes if going to create multiple
class University {
  private root?: FileSystemDirectoryHandle | null;
  private teachingBoard?: TeachingBoard;

  async initialize() {
    const root = await this.setupHomeDirectory();

    const stemProfessor = await new STEMProfessor(root);
    await stemProfessor.initialize();

    const teachingBoard = {
      stem: stemProfessor,
    };

    this.root = root;
    this.teachingBoard = teachingBoard;
  }

  public getRoot() {
    return this.root;
  }

  public getTeachingBoard() {
    return this.teachingBoard;
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
