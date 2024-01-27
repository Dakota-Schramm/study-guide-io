"use client";

import React, { useEffect, useState } from "react";

const PdfWizard = () => {
  const [urls, setUrls] = useState(undefined);

  useEffect(() => {
    console.log(urls);
  }, [urls]);

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
