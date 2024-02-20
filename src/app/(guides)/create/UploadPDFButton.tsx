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
    : "uninitialized";

  const buttonVariant =
    buttonState === "uninitialized"
      ? undefined
      : buttonState === "valid"
        ? "success"
        : "destructive";

  return (
    <Label className="group">
      <span className="hidden"> Upload PDFs: </span>
      <Input
        className="hidden"
        ref={inputRef}
        id="pdfs"
        name="pdfs"
        type="file"
        accept=".pdf"
        multiple
        required
      />
      <Button
        className="group-has-[:invalid]:bg-destructive group-has-[:valid]:bg-green-500 w-full"
        type="button"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <GrDocumentPdf />
      </Button>
    </Label>
  );
};

export default UploadPDFButton;
