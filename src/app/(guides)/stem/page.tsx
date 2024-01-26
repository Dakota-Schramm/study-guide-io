"use client";

import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

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
        method="post"
        onChange={(ev) => {
          const urls = [];
          for (const file of ev.target.files) {
            urls.push(URL.createObjectURL(file));
          }
          // setUrls(urls)
          setUrls(ev.target.files);
        }}
      >
        <input type="file" accept="application/pdf" multiple />
        <button type="submit">Start your guide</button>
      </form>
      {urls && <PDFViewer filePath={urls[0]} />}
    </>
  );
};

export default STEM;
