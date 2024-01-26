"use client";

import React, { useEffect, useState } from "react";

import PDFViewer from "../pdf_uploader";

const STEM = () => {
  const [urls, setUrls] = useState(undefined);

  useEffect(() => {
    console.log(urls);
  }, [urls]);

  return (
    <>
      <div>STEM</div>
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

export default STEM;
