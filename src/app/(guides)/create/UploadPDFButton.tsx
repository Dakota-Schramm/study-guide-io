import React, { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GrDocumentPdf } from "react-icons/gr";
import { Button } from "@/components/ui/button";

const UploadPDFButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      className="primary destructive"
      type="button"
      onClick={() => {
        inputRef.current?.click();
      }}
    >
      <GrDocumentPdf />
      <Label className="hidden">
        Upload PDFs:
        <Input
          ref={inputRef}
          id="pdfs"
          name="pdfs"
          type="file"
          accept=".pdf"
          multiple
          required
        />
      </Label>
    </Button>
  );
};

export default UploadPDFButton;
