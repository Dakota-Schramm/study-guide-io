"use client";

import React, { forwardRef, useState } from "react";
import PDFViewer from "./PdfViewer";

const PdfUploader = forwardRef(function PdfUploader(
  { hidden, handleNextStep },
  ref,
) {
  const [uploaded, setUploaded] = useState(false);
  const filePath = ref?.current?.files?.[0];

  console.log(`PdfUploader hidden: ${hidden}`);
  console.log(`PdfUploader ref: ${ref}`);

  return (
    <div className={hidden ? "invisible absolute" : undefined}>
      <label>
        Upload PDFs:
        <input
          ref={ref}
          name="pdf"
          type="file"
          accept=".pdf"
          multiple
          onChange={(ev) => {
            const filesExist = 1 <= (ev.target?.files?.length ?? 0);
            if (filesExist) setUploaded(true);
          }}
        />
      </label>
      {uploaded && (
        <>
          <PDFViewer {...{ filePath }} />
          <button type="button" onClick={handleNextStep}>
            Next
          </button>
        </>
      )}
    </div>
  );
});

export default PdfUploader;
