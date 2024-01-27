"use client";

import React, { useEffect, useState } from "react";
import PDFViewer from "./PdfViewer";

const PdfWizard = () => {
  const [urls, setUrls] = useState(undefined);

  return (
    <>
      <form
        id="pdf-submit"
        className="flex flex-col"
        onChange={(ev) => {
          setUrls(ev.target.files);
        }}
      >
        <input type="file" accept="application/pdf" multiple />
      </form>
      {urls && <PDFViewer filePath={urls[0]} />}
    </>
  );
};

export default PdfWizard;
