"use client";

import React, { useState } from "react";
import PDFViewer from "./PdfViewer";

const PdfUploader = ({ hidden, handleNextStep }) => {
  const [urls, setUrls] = useState(undefined);

  console.log(`PdfWizard hidden: ${hidden}`);

  return (
    <div className={hidden ? "invisible" : undefined}>
      <input
        name="pdf"
        type="file"
        accept=".pdf"
        multiple
        onChange={(ev) => {
          console.log(ev.target);
          setUrls(ev.target.files);
        }}
      />
      {urls && (
        <>
          <PDFViewer filePath={urls[0]} />
          <button type="button" onClick={handleNextStep}>
            Next
          </button>
        </>
      )}
    </div>
  );
};

export default PdfUploader;
