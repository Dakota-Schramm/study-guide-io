"use client";

import React, { useState } from "react";

import { Label } from "@/components/ui/label";
import FileInput from "@/components/FileInput";

import PDFViewer from "./PdfViewer";

const PdfUploader = () => {
  const [uploaded, setUploaded] = useState(false);

  return (
    <>
      <Label>
        Upload PDFs:
        <FileInput
          accept=".pdf"
          multiple
          onChange={(ev) => {
            const filesExist = 1 <= (ev.target?.files?.length ?? 0);
            if (filesExist) setUploaded(true);
          }}
        />
      </Label>
      {uploaded && (
        <PDFViewer
          // dialogSize={{ width: 800, height: 800 }}
          pageSize={{ width: 400, height: 400 }}
          {...{ filePath }}
        />
      )}
    </>
  );
};

export default PdfUploader;
