"use client";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  window.log.info({ filePath, pageTotal });

  if (!filePath) return;

  // TODO: Add better handling here for large pdfs
  // TODO: Add drag-and-drop support for reordering pages of pdf
  return (
    <Document file={filePath} onLoadSuccess={handleDocumentLoadSuccess}>
      <details>
        <summary>Pages</summary>
        <div className="flex flex-col w-64 h-64 overflow-x-hidden overflow-y-auto">
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
    <Dialog>
      <DialogTrigger>View PDF Details</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>PDF: </DialogTitle>
          <DialogDescription>See your pdf in detail.</DialogDescription>
        </DialogHeader>
        <PDF
          handleDocumentLoadSuccess={onDocumentLoadSuccess}
          filePath={filePath}
          pageTotal={pdfStatus?.pageTotal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
