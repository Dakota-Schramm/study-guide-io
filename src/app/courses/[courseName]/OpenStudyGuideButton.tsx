"use client";

import React, { useEffect, useState } from "react";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PiFileMagnifyingGlass } from "react-icons/pi";

import {
  PDF,
  type LoadedPDF,
} from "@/app/(guides)/_guide_creation/pdf/PdfViewer";

type OpenStudyGuideButtonProps = {
  fileName: string;
  file: FileSystemFileHandle;
};

export const OpenStudyGuideButton = ({
  fileName,
  file,
}: OpenStudyGuideButtonProps) => {
  const [pdfStatus, setPdfStatus] = useState<LoadedPDF>({
    status: "uninitialized",
  });
  const [fileObj, setFileObj] = useState<File | undefined>(undefined);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setPdfStatus({
      status: "loaded",
      currentPage: 1,
      pageTotal: numPages,
    });
  }

  async function handleClick() {
    if (!file || fileObj) {
      return;
    }

    setFileObj(await file.getFile());
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleClick}>
                <PiFileMagnifyingGlass />
              </Button>
            </DialogTrigger>
            <DialogContent
            // style={dialogStyle}
            >
              <DialogHeader>
                <DialogTitle>PDF: </DialogTitle>
                <DialogDescription>See your pdf in detail.</DialogDescription>
              </DialogHeader>
              <PDF
                width={800}
                height={800}
                handleDocumentLoadSuccess={onDocumentLoadSuccess}
                filePath={fileObj}
                pageTotal={pdfStatus?.pageTotal}
              />
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>Open {fileName}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
