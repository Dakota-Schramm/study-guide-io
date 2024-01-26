"use client";

import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

const PDFControls = ({
  currentPage,
  pageTotal,
  handleDecrement,
  handleIncrement,
}) => {
  return (
    <>
      <button type="button" onClick={handleDecrement}>
        Decrement
      </button>
      <p>
        Page {currentPage} of {pageTotal}
      </p>
      <button type="button" onClick={handleIncrement}>
        Increment
      </button>
    </>
  );
};

type LoadedPDF =
  | {
      status: "uninitialized";
    }
  | {
      status: "loaded";
      pageTotal: number;
      currentPage: number;
    };

const PDF = ({ filePath }: { filePath: string }) => {
  const [pdfStatus, setPdfStatus] = useState<LoadedPDF>({
    status: "uninitialized",
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setPdfStatus({
      status: "loaded",
      currentPage: 1,
      pageTotal: numPages,
    });
  }

  const currentPage = pdfStatus?.currentPage || 0;
  const pageTotal = pdfStatus?.pageTotal || 0;

  function handleDecrement() {
    setPdfStatus((prevStatus) => ({
      ...prevStatus,
      currentPage: Math.max(0, currentPage - 1),
    }));
  }

  function handleIncrement() {
    setPdfStatus((prevStatus) => ({
      ...prevStatus,
      currentPage: Math.min(pageTotal, currentPage + 1),
    }));
  }

  console.log({ filePath });

  return (
    <div className="w-64 h-64">
      <Document file={filePath} onLoadSuccess={onDocumentLoadSuccess}>
        {new Array(pageTotal).map((pg) => (
          <Page pageNumber={pg} />
        ))}
      </Document>
      <PDFControls
        {...{
          currentPage,
          pageTotal,
          handleDecrement,
          handleIncrement,
        }}
      />
    </div>
  );
};

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
      {urls && <PDF filePath={urls[0]} />}
    </>
  );
};

export default STEM;
