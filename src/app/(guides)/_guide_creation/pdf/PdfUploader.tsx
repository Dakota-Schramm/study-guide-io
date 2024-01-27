"use client";

import React, { forwardRef, useEffect, useState } from "react";
import PDFViewer from "./PdfViewer";

const PdfUploader = forwardRef(function PdfUploader(props, ref) {
  const { hidden, handleNextStep } = props;
  const filePath = ref?.current?.files?.[0];

  console.log(`PdfWizard hidden: ${hidden}`);

  return (
    <div className={hidden ? "invisible" : undefined}>
      <input ref={ref} name="pdf" type="file" accept=".pdf" multiple />
      {filePath && (
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
