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

type PDFProps = {
  filePath: string;
  handleDocumentLoadSuccess: (arg0: number) => void;
  pageTotal?: number;
};

const PDF = ({
  filePath,
  handleDocumentLoadSuccess,
  pageTotal = 0,
}: PDFProps) => {
  console.log({ filePath });

  if (!filePath) return;

  return (
    // <Document file={filePath} onLoadSuccess={handleDocumentLoadSuccess}>
    //   {Array(pageTotal).map((_, pg) => (
    //     <Page pageNumber={pg + 1} />
    //   ))}
    // </Document>
    <Document file={filePath} onLoadSuccess={handleDocumentLoadSuccess}>
      <Page width={200} height={200} pageNumber={1} />
    </Document>
  );
};

const PDFViewer = ({ filePath }) => {
  const [pdfStatus, setPdfStatus] = useState<LoadedPDF>({
    status: "uninitialized",
  });
  const { status } = pdfStatus;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setPdfStatus({
      status: "loaded",
      currentPage: 1,
      pageTotal: numPages,
    });
  }

  function handleDecrement() {
    const currentPage = pdfStatus?.currentPage
      ? Math.max(1, pdfStatus.currentPage - 1)
      : 1;

    setPdfStatus((prevStatus) => ({
      ...prevStatus,
      currentPage,
    }));
  }

  function handleIncrement() {
    const pageTotal = pdfStatus?.pageTotal ? pdfStatus.pageTotal : 0;

    const currentPage = pdfStatus?.currentPage
      ? Math.min(pageTotal, pdfStatus.currentPage + 1)
      : 0;

    setPdfStatus((prevStatus) => ({
      ...prevStatus,
      currentPage,
    }));
  }

  return (
    <div className="w-64 h-64">
      <PDF
        handleDocumentLoadSuccess={onDocumentLoadSuccess}
        filePath={filePath}
        pageTotal={pdfStatus?.pageTotal}
      />
      {status !== "uninitialized" && (
        <PDFControls
          currentPage={pdfStatus?.currentPage}
          pageTotal={pdfStatus?.pageTotal}
          {...{
            handleDecrement,
            handleIncrement,
          }}
        />
      )}
    </div>
  );
};

export default PDFViewer;
