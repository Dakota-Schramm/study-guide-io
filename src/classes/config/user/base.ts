import { PDFComponents } from "@/app/(guides)/_guide_creation/Finalize";
import { createFileObjectUrl } from "@/app/(guides)/_guide_creation/pdf/createPdf";
// TODO: Implement base class for Full Access and Restricted users

export type FullAccessDownloadGuideOptions = {
  courseName: string;
  fileName: string;
};

export abstract class BaseUserConfig {
  abstract initialize(): void;

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

  //? Not sure what implementation requirements for this are. Can this have different signatures?
  abstract downloadGuideToFileSystem(
    pdfFiles: PDFComponents["pdfFiles"],
    attachmentFiles: PDFComponents["attachmentFiles"],
    fullAccessOptions?: FullAccessDownloadGuideOptions,
  ): void | Promise<void>;
}
