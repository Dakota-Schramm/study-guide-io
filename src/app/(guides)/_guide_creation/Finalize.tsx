"use client";
import React from "react";

import { createPdf } from "./pdf/createPdf";

export const Finalize = ({
  hidden,
  pdfFiles,
  attachmentFiles,
  handlePrevStep,
}) => {
  console.log(`Finalize hidden: ${hidden}`);

  function handleDownload(pdfFiles, attachmentFiles) {
    let pdfUrl: string;
    createPdf(pdfFiles, attachmentFiles)
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
        type="button"
        onClick={() => handleDownload(pdfFiles, attachmentFiles)}
      >
        Complete
      </button>
    </div>
  );
};
