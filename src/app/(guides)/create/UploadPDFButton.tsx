import React, { useRef, useState } from "react";
import clsx from "clsx";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { GrDocumentPdf } from "react-icons/gr";

const UploadPDFButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [firstInteraction, setFirstInteraction] = useState(false);

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
        className={clsx(
          "w-full", {
            "group-has-[:invalid]:bg-destructive  group-has-[:valid]:bg-green-500 w-full": firstInteraction,
          }
        )}
        type="button"
        onClick={() => {
          setFirstInteraction(true);
          inputRef.current?.click();
        }}
      >
        <GrDocumentPdf />
      </Button>
    </Label>
  );
};

export default UploadPDFButton;
