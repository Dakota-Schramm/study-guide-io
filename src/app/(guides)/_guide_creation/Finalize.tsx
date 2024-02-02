"use client";
import React from "react";

import { createFileObjectUrl, createPdf } from "./pdf/createPdf";

type FinalizeProps = {
  rendered: boolean;
  hidden: boolean;
  pdfFiles: FileList;
  attachmentFiles: FileList;
  handlePrevStep: () => void;
};

// TODO: Change name of downloaded file
export const Finalize = ({
  rendered,
  hidden,
  pdfFiles,
  attachmentFiles,
  handlePrevStep,
}: FinalizeProps) => {
  console.log(`Finalize hidden: ${hidden}`);

  if (!rendered) return;

  async function handleDownload(
    pdfFiles: FinalizeProps["pdfFiles"],
    attachmentFiles: FinalizeProps["attachmentFiles"],
    courseHandle: FileSystemDirectoryHandle,
  ) {
    if (!pdfFiles || !attachmentFiles) return;
    startDownload(pdfFiles, attachmentFiles);
    const pdfBlob = await createPdf(pdfFiles, attachmentFiles);
    const draftHandle = await courseHandle.getFileHandle("draft.txt", {
      create: true,
    });
    const writable = await draftHandle.createWritable();

    // Write the contents of the file to the stream.
    await writable.write(pdfBlob);

    // Close the file and write the contents to disk.
    await writable.close();
  }

  return (
    <div className={hidden ? "invisible" : undefined}>
      <h2>Finalize</h2>
      <p>Does this look good to you? If so, click "Complete"</p>
      <button type="button" onClick={handlePrevStep}>
        Previous
      </button>
      <button
        data-testid="downloadGuide"
        type="button"
        onClick={() => handleDownload(pdfFiles, attachmentFiles)}
      >
        Complete
      </button>
    </div>
  );
};

function startDownload(pdfFiles, attachmentFiles) {
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
