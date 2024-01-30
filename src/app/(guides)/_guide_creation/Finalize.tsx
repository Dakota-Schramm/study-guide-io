"use client";
import React from "react";

import { createFileObjectUrl } from "./pdf/createPdf";

type FinalizeProps = {
  hidden: boolean;
  pdfFiles: FileList;
  attachmentFiles: FileList;
  handlePrevStep: () => void;
};

export const Finalize = ({
  hidden,
  pdfFiles,
  attachmentFiles,
  handlePrevStep,
}: FinalizeProps) => {
  console.log(`Finalize hidden: ${hidden}`);

  function handleDownload(
    pdfFiles: FinalizeProps["pdfFiles"],
    attachmentFiles: FinalizeProps["attachmentFiles"],
  ) {
    if (!pdfFiles || !attachmentFiles) return;

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
