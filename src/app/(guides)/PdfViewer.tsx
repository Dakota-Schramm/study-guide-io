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
  currentPage?: number;
  pageTotal?: number;
};

const PDF = ({
  filePath,
  handleDocumentLoadSuccess,
  currentPage = 0,
  pageTotal = 0,
}: PDFProps) => {
  console.log({ filePath });

  if (!filePath) return;

  // TODO: Add better handling here for large pdfs
  // TODO: Add drag-and-drop support for reordering pages of pdf
  return (
    <Document file={filePath} onLoadSuccess={handleDocumentLoadSuccess}>
      {Array.from(new Array(pageTotal), (_, index) => (
        <Page
          //! key={`base_ordering_${index}`} Replace with crypto hash at creation?
          width={200}
          height={200}
          pageNumber={index + 1}
        />
      ))}
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
