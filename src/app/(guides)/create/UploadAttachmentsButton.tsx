import React, { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GrDocumentImage } from "react-icons/gr";
import { Button } from "@/components/ui/button";

const UploadAttachmentsButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Button
      className="primary destructive"
      type="button"
      onClick={() => {
        inputRef.current?.click();
      }}
    >
      <GrDocumentImage />
      <Label className="hidden">
        Upload images:{" "}
        <Input
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
