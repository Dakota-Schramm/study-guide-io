"use client";

import React, { forwardRef, useState } from "react";
import PDFViewer from "./PdfViewer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const PdfUploader = forwardRef(function PdfUploader(
  { rendered, hidden, handleNextStep },
  ref,
) {
  const [uploaded, setUploaded] = useState(false);
  const filePath = (ref?.current as HTMLInputElement)?.files?.[0];

  console.log(`PdfUploader hidden: ${hidden}`);
  console.log(`PdfUploader ref: ${ref}`);

  if (!rendered) return;

  return (
    <div className={hidden ? "invisible absolute" : undefined}>
      <Label>
        Upload PDFs:
        <Input
          ref={ref}
          name="pdf"
          type="file"
          accept=".pdf"
          multiple
          onChange={(ev) => {
            const filesExist = 1 <= (ev.target?.files?.length ?? 0);
            if (filesExist) setUploaded(true);
          }}
        />
      </Label>
      {uploaded && (
        <>
          <PDFViewer
            // dialogSize={{ width: 800, height: 800 }}
            pageSize={{ width: 400, height: 400 }}
            {...{ filePath }}
          />
          <button type="button" onClick={handleNextStep}>
            Next
          </button>
        </>
      )}
    </div>
  );
});

export default PdfUploader;
