import React, { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GrDocumentImage } from "react-icons/gr";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const UploadAttachmentsButton = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFiles = inputRef.current?.files?.length > 0 ?? false;

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
        className={clsx("w-full", {
          "bg-accent": hasFiles,
        })}
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
