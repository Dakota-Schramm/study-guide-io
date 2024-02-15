"use client";

import React, { useContext, useState } from "react";

import { Label } from "@/components/ui/label";
import FileInput from "@/components/FileInput";

import PDFViewer from "./PdfViewer";
import { FormContext } from "../GuideCreationForm";

// TODO: Add better support for adding multiple files at once
const PdfUploader = ({ files }) => {
  const { form, setForm } = useContext(FormContext);
  const [uploaded, setUploaded] = useState(false);

  return (
    <>
      <Label>
        Upload PDFs:
        <FileInput
          accept=".pdf"
          multiple
          fileList={files}
          onChange={(files) => {
            const filesExist = 1 <= (files?.length ?? 0);
            if (filesExist) setUploaded(true);
            setForm((f) => ({ ...f, pdfs: files }));
          }}
        />
      </Label>
      {uploaded && (
        <PDFViewer
          // dialogSize={{ width: 800, height: 800 }}
          pageSize={{ width: 400, height: 400 }}
          filePath={form.pdfs[0]}
        />
      )}
    </>
  );
};

export default PdfUploader;
