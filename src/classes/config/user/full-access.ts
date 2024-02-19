import { ensureError, sitePath } from "@/lib/utils";
import { BaseUserConfig } from "./base";
import { getAppHandlesFromDB, saveAppHandlesToDB } from "@/lib/idbUtils";

export class FullAccessUserConfig extends BaseUserConfig {
  async initialize() {
    window.log.info("Initializing FullAccessUserConfig");
    const root = await this.getHomeDirectory();
    await super.initialize(root);
    window.log.info("FullAccessUserConfig initialized");
  }

  private async getHomeDirectory() {
    const handles = await getAppHandlesFromDB();

    let root = handles?.find((h) => h.name === sitePath);
    let isPermitted;
    if (!root) {
      root = await this.initializeHomeDirectory();
    } else {
      isPermitted =
        (await root.requestPermission({
          mode: "readwrite",
        })) === "granted";
    }

    return isPermitted ? root : null;
  }

  /**
   * requires use of window
   * MUST BE a user action to work
   */
  private async initializeHomeDirectory() {
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

    await saveAppHandlesToDB({ root: homeDir });
    return homeDir;
  }

  // TODO: Add more options for control of folders
  // ==> add another subclass of user
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

      window.log.error(`${err.name}: ${err.message}`);
      return null;
    }
  }
}
