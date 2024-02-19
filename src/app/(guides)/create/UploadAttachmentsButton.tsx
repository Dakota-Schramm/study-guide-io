import React, { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GrDocumentImage } from "react-icons/gr";
import { Button } from "@/components/ui/button";

const UploadAttachmentsButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const isFilled = inputRef.current?.files.length > 0;

  return (
    <Button
      className="primary destructive"
      type="button"
      variant={isFilled ? "success" : "destructive"}
      onClick={() => {
        inputRef.current?.click();
      }}
    >
      <GrDocumentImage className="peer-invalid:fill-red-500 peer-valid:fill-green-500" />
      <Label className="hidden">
        Upload images:{" "}
        <Input
          className="peer"
          ref={inputRef}
          id="attachments"
          name="attachments"
          type="file"
          accept=".png, .jpg"
          multiple
          required
        />
      </Label>
    </Button>
  );
};

export default UploadAttachmentsButton;
