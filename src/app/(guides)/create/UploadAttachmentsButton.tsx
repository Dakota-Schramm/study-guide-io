import React, { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GrDocumentImage } from "react-icons/gr";
import { Button } from "@/components/ui/button";

const UploadAttachmentsButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Label className="group">
      <span className="hidden">Upload buttons</span>
      <Input
        className="hidden"
        ref={inputRef}
        id="attachments"
        name="attachments"
        type="file"
        accept=".png, .jpg"
        multiple
      />
      <Button
        className="bg-secondary group-has-[:valid]:bg-accent w-full"
        type="button"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <GrDocumentImage className="fill-current" />
      </Button>
    </Label>
  );
};

export default UploadAttachmentsButton;
