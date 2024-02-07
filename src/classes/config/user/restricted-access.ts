import { createFileObjectUrl } from "@/app/(guides)/_guide_creation/pdf/createPdf";

export class RestrictedAccessUserConfig {
  async initialize() {}

  // TODO: Use cookie to track file download
  // https://stackoverflow.com/questions/1106377/detect-when-a-browser-receives-a-file-download
  public downloadGuide(pdfFiles: FileList, attachmentFiles: FileList) {
    console.log({ pdfFiles, attachmentFiles });
    let pdfUrl: string;

    createFileObjectUrl(pdfFiles, attachmentFiles)
      .then((fileObjectUrl) => {
        const downloadEle = document.createElement("a");
        downloadEle.href = fileObjectUrl;
        downloadEle.download = "test.pdf";
        downloadEle.click();

        console.log("Download succeeded");
        pdfUrl = fileObjectUrl;
      })
      .catch(() => console.log("Download failed"))
      .finally(() => {
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        console.log("exiting");
      });
  }
}
