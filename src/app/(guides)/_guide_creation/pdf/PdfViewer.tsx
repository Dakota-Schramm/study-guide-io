"use client";

import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

type LoadedPDF =
  | {
      status: "uninitialized";
    }
  | {
      status: "loading";
      file?: FileSystemFileHandle;
    }
  | {
      status: "loaded";
      pageTotal: number;
      file: FileSystemFileHandle;
    };

type PDFProps = {
  file: FileSystemFileHandle;
  handleDocumentLoadSuccess: (arg0: number) => void;
  pageTotal?: number;
};

const PDF = ({ file, handleDocumentLoadSuccess, pageTotal = 0 }: PDFProps) => {
  console.log({ file });

  if (!file) return;

  // TODO: Add better handling here for large pdfs
  // TODO: Add drag-and-drop support for reordering pages of pdf
  return (
    <Document onLoadSuccess={handleDocumentLoadSuccess} {...{ file }}>
      <details>
        <summary>Pages</summary>
        <div className="flex">
          {Array.from(new Array(pageTotal), (_, index) => (
            <Page
              //! key={`base_ordering_${index}`} Replace with crypto hash at creation?
              width={200}
              height={200}
              pageNumber={index + 1}
            />
          ))}
        </div>
      </details>
    </Document>
  );
};

const PDFViewer = ({ fileHandle }: { fileHandle: FileSystemFileHandle }) => {
  const [pdfStatus, setPdfStatus] = useState<LoadedPDF>({
    status: "uninitialized",
  });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setPdfStatus((prev) => ({
      ...prev,
      status: "loaded",
      pageTotal: numPages,
    }));
  }

  useEffect(() => {
    async function getFile() {
      const file = await fileHandle.getFile();
      setPdfStatus((prev) => ({
        ...prev,
        status: "loading",
        file,
      }));
    }
    getFile();
  }, []);

  return (
    <div className="w-64 h-64">
      <PDF
        handleDocumentLoadSuccess={onDocumentLoadSuccess}
        pageTotal={pdfStatus?.pageTotal}
        file={pdfStatus.file}
      />
    </div>
  );
};

export default PDFViewer;
