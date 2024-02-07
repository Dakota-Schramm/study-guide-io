import { PDFComponents } from "@/app/(guides)/_guide_creation/Finalize";
import { createFileObjectUrl } from "@/app/(guides)/_guide_creation/pdf/createPdf";
import { BaseUserConfig } from "./base";

export class RestrictedAccessUserConfig extends BaseUserConfig {
  async initialize() {}

  // TODO: Use cookie to track file download
  // https://stackoverflow.com/questions/1106377/detect-when-a-browser-receives-a-file-download
  public downloadGuide(
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
      .catch(() => window.log.error("Download failed"))
      .finally(() => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        window.log.info("exiting");
      });
  }
}
