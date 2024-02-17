import { PDFComponents } from "@/app/(guides)/_guide_creation/Finalize";
import {
  createFileObjectUrl,
  createPdf,
} from "@/app/(guides)/_guide_creation/pdf/createPdf";
import { ensureError } from "@/lib/utils";
// TODO: Implement base class for Full Access and Restricted users

type DownloadGuideOptions = {
  courseName: string;
  fileName: string;
};

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

  // TODO: Use cookie to track file download
  // https://stackoverflow.com/questions/1106377/detect-when-a-browser-receives-a-file-download
  public download(
    pdfFiles: PDFComponents["pdfFiles"],
    attachmentFiles: PDFComponents["attachmentFiles"],
  ) {
    window.log.info({ pdfFiles, attachmentFiles });
    let pdfUrl: string;

    createFileObjectUrl(pdfFiles, attachmentFiles)
      .then((fileObjectUrl) => {
        const downloadEle = document.createElement("a");
        downloadEle.href = fileObjectUrl;
        downloadEle.download = "test.pdf";
        downloadEle.click();

        window.log.info("Download succeeded");
        pdfUrl = fileObjectUrl;
      })
      .catch((err) => window.log.error({ err }))
      .finally(() => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        window.log.info("exiting");
      });
  }

  public async downloadGuideToFileSystem(
    pdfFiles: PDFComponents["pdfFiles"],
    attachmentFiles: PDFComponents["attachmentFiles"],
    options: DownloadGuideOptions,
  ) {
    if (!pdfFiles || !attachmentFiles) return;

    const pdfBlob = await createPdf(pdfFiles, attachmentFiles);
    this.downloadBlobToFileSystem(pdfBlob, options);
    // TODO: Fix so that doesn't require app reload after redirect
    // Permission state doesnt stay after full page refresh
    // window.location.href = "/";
  }

  public async downloadBlobToFileSystem(
    pdfBlob: Blob,
    options: DownloadGuideOptions,
  ) {
    const { courseName, fileName } = options;

    const courseHandle = await this.findCourseHandle("STEM", courseName, {
      create: true,
    });
    if (!courseHandle) return;

    const draftHandle = await courseHandle.getFileHandle(`${fileName}.pdf`, {
      create: true,
    });
    const writable = await draftHandle.createWritable();

    // Write the contents of the file to the stream.
    await writable.write(pdfBlob);

    // Close the file and write the contents to disk.
    await writable.close();
  }
}
