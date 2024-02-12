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

export type LoadedPDF =
  | {
      status: "uninitialized";
    }
  | {
      status: "loaded";
      pageTotal: number;
      currentPage: number;
    };

export type PDFProps = {
  filePath: File;
  handleDocumentLoadSuccess: (arg0: number) => void;
  currentPage?: number;
  pageTotal?: number;
  width: number;
  height: number;
};

const PDF = ({
  filePath,
  handleDocumentLoadSuccess,
  pageTotal = 0,
  width,
  height,
}: PDFProps) => {
  window.log.info({ filePath, pageTotal });

  if (!filePath) return;

  // TODO: Add better handling here for large pdfs
  // TODO: Add drag-and-drop support for reordering pages of pdf
  // TODO: Keep widths and heights consistent between styles and page props
  return (
    <Document file={filePath} onLoadSuccess={handleDocumentLoadSuccess}>
      <details>
        <summary>Pages</summary>
        <div
          className="flex flex-col overflow-x-hidden overflow-y-auto"
          style={{
            width: `${width + width * 0.05}px`,
            height: `${height + height * 0.05}px`,
          }}
        >
          {Array.from(new Array(pageTotal), (_, index) => (
            <Page
              //! key={`base_ordering_${index}`} Replace with crypto hash at creation?
              width={width}
              height={height}
              pageNumber={index + 1}
            />
          ))}
        </div>
      </details>
    </Document>
  );
};

const PDFViewer = ({
  filePath,
  dialogSize,
  pageSize,
}: {
  filePath: File;
  dialogSize: { width: number; height: number };
  pageSize: { width: number; height: number };
}) => {
  const [pdfStatus, setPdfStatus] = useState<LoadedPDF>({
    status: "uninitialized",
  });
  const { status } = pdfStatus;
  const dialogStyle =
    dialogSize?.width && dialogSize?.height
      ? {
          width: `${dialogSize.width}px`,
          height: `${dialogSize.height}px`,
        }
      : undefined;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setPdfStatus({
      status: "loaded",
      currentPage: 1,
      pageTotal: numPages,
    });
  }

  return (
    <Dialog>
      <DialogTrigger>View PDF Details</DialogTrigger>
      <DialogContent style={dialogStyle}>
        <DialogHeader>
          <DialogTitle>PDF: </DialogTitle>
          <DialogDescription>See your pdf in detail.</DialogDescription>
        </DialogHeader>
        <PDF
          width={pageSize.width}
          height={pageSize.height}
          handleDocumentLoadSuccess={onDocumentLoadSuccess}
          filePath={filePath}
          pageTotal={pdfStatus?.pageTotal}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
