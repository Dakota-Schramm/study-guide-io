import { PDFComponents } from "@/app/(guides)/_guide_creation/Finalize";
import { createPdf } from "@/app/(guides)/_guide_creation/pdf/createPdf";
import { ensureError, sitePath } from "@/lib/utils";
import { BaseUserConfig, FullAccessDownloadGuideOptions } from "./base";
import {
  getAppHandlesFromDB,
  saveAppHandlesToDB,
  syncHandles,
} from "@/lib/idbUtils";

type UserFileSystemHandles = {
  [key: string]: Nullable<FileSystemDirectoryHandle>;
};

type findCourseHandleOptions = {
  create: boolean;
};

export class FullAccessUserConfig extends BaseUserConfig {
  private handles?: UserFileSystemHandles;

  async initialize() {
    this.handles = await this.setupHandles();
  }

  public getRoot(): Nullable<FileSystemDirectoryHandle> {
    return this.handles?.root;
  }

  async downloadGuide(
    pdfFiles: PDFComponents["pdfFiles"],
    attachmentFiles: PDFComponents["attachmentFiles"],
    fullAccessOptions: FullAccessDownloadGuideOptions,
  ) {
    const { courseName, fileName } = fullAccessOptions;
    if (!pdfFiles || !attachmentFiles) return;

    const courseHandle = await this.findCourseHandle("STEM", courseName, {
      create: true,
    });
    if (!courseHandle) return;

    const pdfBlob = await createPdf(pdfFiles, attachmentFiles);
    const draftHandle = await courseHandle.getFileHandle(`${fileName}.pdf`, {
      create: true,
    });
    const writable = await draftHandle.createWritable();

    // Write the contents of the file to the stream.
    await writable.write(pdfBlob);

    // Close the file and write the contents to disk.
    await writable.close();

    // TODO: Fix so that doesn't require app reload after redirect
    // Permission state doesnt stay after full page refresh
    // window.location.href = "/";
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

  /**
   *
   * @param handles
   * modifies the Object passed to the function
   */
  private async setupHandles(): Promise<{
    [key: string]: FileSystemDirectoryHandle;
  }> {
    const root = await this.getHomeDirectory();
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

    return handles;
  }

  private async getHomeDirectory() {
    const handles = await getAppHandlesFromDB();
    console.log({ handles });
    let root = handles?.find((h) => h.name === sitePath);
    if (!root) {
      root = await this.initializeHomeDirectory();
    } else {
      await root.requestPermission({
        mode: "readwrite",
      });
    }

    return root;
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
