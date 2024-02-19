import React, { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GrDocumentPdf } from "react-icons/gr";
import { Button } from "@/components/ui/button";

const UploadPDFButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [firstInteraction, setFirstInteraction] = useState(false);

  const buttonState = firstInteraction
    ? inputRef.current?.files
      ? "valid"
      : "invalid"
    : "uninitialized"

  const buttonVariant = buttonState === "uninitialized"
    ? undefined 
    : buttonState === "valid"
      ? "success"
      : "destructive";

  return (
    <Button
      variant={buttonVariant}
      type="button"
      onClick={() => {
        setFirstInteraction(true);
        inputRef.current?.click();
      }}
    >
      <GrDocumentPdf className={buttonVariant && buttonVariant === "success" ? "fill-success" : "fill-destructive"}/>
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
