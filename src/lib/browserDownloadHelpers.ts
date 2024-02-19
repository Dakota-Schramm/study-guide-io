import {
  createFileObjectUrl,
  createPdf,
} from "@/app/(guides)/_guide_creation/pdf/createPdf";

type DownloadGuideOptions = {
  courseName: string;
  fileName: string;
};

// TODO: Use cookie to track file download
// https://stackoverflow.com/questions/1106377/detect-when-a-browser-receives-a-file-download
// Move this off of config so can be used when user is not init'd
function downloadToBrowser(
  pdfFiles: PDFComponents["pdfFiles"],
  attachmentFiles: PDFComponents["attachmentFiles"],
) {
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

async function downloadGuideToFileSystem(
  courseHandle: FileSystemDirectoryHandle,
  files: {
    pdfFiles: PDFComponents["pdfFiles"];
    attachmentFiles: PDFComponents["attachmentFiles"];
  },
  options: DownloadGuideOptions,
) {
  const { pdfFiles, attachmentFiles } = files;

  if (!pdfFiles || !attachmentFiles) return;

  const pdfBlob = await createPdf(pdfFiles, attachmentFiles);
  this.downloadBlobToFileSystem(courseHandle, pdfBlob, options);
  // TODO: Fix so that doesn't require app reload after redirect
  // Permission state doesnt stay after full page refresh
  // window.location.href = "/";
}

async function downloadBlobToFileSystem(
  courseHandle: FileSystemDirectoryHandle,
  pdfBlob: Blob,
  options: DownloadGuideOptions,
) {
  const { courseName, fileName } = options;

  const draftHandle = await courseHandle.getFileHandle(`${fileName}.pdf`, {
    create: true,
  });
  const writable = await draftHandle.createWritable();

  // Write the contents of the file to the stream.
  await writable.write(pdfBlob);

  // Close the file and write the contents to disk.
  await writable.close();
}

export {
  downloadToBrowser,
  downloadGuideToFileSystem,
  downloadBlobToFileSystem,
};
