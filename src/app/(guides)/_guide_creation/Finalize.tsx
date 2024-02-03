"use client";
import React, { useContext } from "react";

import { createFileObjectUrl, createPdf } from "./pdf/createPdf";
import { DeanContext } from "@/contexts/DeanContext";
import { useRouter } from "next/router";

type PDFComponents = {
  pdfFiles: FileList;
  attachmentFiles: FileList;
  courseName: string;
  fileName: string;
};

type FinalizeProps = {
  rendered: boolean;
  hidden: boolean;
  components: PDFComponents;
  handlePrevStep: () => void;
};

// TODO: Change name of downloaded file
export const Finalize = ({
  rendered,
  hidden,
  components,
  handlePrevStep,
}: FinalizeProps) => {
  // console.log(`Finalize hidden: ${hidden}`);

  const { dean } = useContext(DeanContext);
  const { stem } = dean;

  if (!rendered) return;

  async function handleSubmit() {
    if (!stem) return;

    const courseHandle = await stem.findCourseHandle(components?.courseName, {
      create: true,
    });
    await handleDownload(files, courseHandle, fileName);

    // TODO: Fix so that doesn't require reload after redirect
    window.location.href = "/";
  }

  const files = {
    pdfFiles: components?.pdfFiles,
    attachmentFiles: components?.attachmentFiles,
  };
  const fileName = components?.fileName || "test.pdf";

  return (
    <div className={hidden ? "invisible" : undefined}>
      <h2>Finalize</h2>
      <p>Does this look good to you? If so, click "Complete"</p>
      <button type="button" onClick={handlePrevStep}>
        Previous
      </button>
      <button data-testid="downloadGuide" type="button" onClick={handleSubmit}>
        Complete
      </button>
    </div>
  );
};

/**
 * Starts download into Downloads folder using old method
 */
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

async function handleDownload(
  files: {
    pdfFiles: PDFComponents["pdfFiles"];
    attachmentFiles: PDFComponents["attachmentFiles"];
  },
  courseHandle: FileSystemDirectoryHandle | null,
  fileName: string,
) {
  const { pdfFiles, attachmentFiles } = files;
  if (!pdfFiles || !attachmentFiles) return;
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
}
