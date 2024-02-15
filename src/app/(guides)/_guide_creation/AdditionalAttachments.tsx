"use client";

import React from "react";

import { Label } from "@/components/ui/label";
import FileInput from "@/components/FileInput";

const AdditionalAttachments = () => {
  // TODO: Allow more file types in input[name="attachments"]
  return (
    <>
      <h2>Add any additional attachments</h2>
      <Label>
        Upload images:
        <FileInput accept=".png, .jpg" multiple />
      </Label>
    </>
  );
};

export default AdditionalAttachments;
