import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import PDFViewer from "./(guides)/_guide_creation/pdf/PdfViewer";

const PDFViewerDialog = ({
  fileHandle,
}: {
  fileHandle: FileSystemFileHandle;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <div className="border border-solid border-black w-20 h-20" />
          <h3>{fileHandle.name}</h3>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
          <PDFViewer {...{ fileHandle }} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewerDialog;
