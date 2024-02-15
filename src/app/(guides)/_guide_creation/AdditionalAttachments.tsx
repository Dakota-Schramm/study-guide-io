"use client";

import React, { useContext } from "react";

import { Label } from "@/components/ui/label";

import FileInput from "@/components/FileInput";
import { FormContext } from "./GuideCreationForm";

const AdditionalAttachments = ({ files }) => {
  const { setForm } = useContext(FormContext);
  // TODO: Allow more file types in input[name="attachments"]
  return (
    <>
      <h2>Add any additional attachments</h2>
      <Label>
        Upload images:
        <FileInput
          accept=".png, .jpg"
          multiple
          fileList={files}
          onChange={(files) => {
            setForm((f) => ({ ...f, attachments: files }));
          }}
        />
      </Label>
    </>
  );
};

export default AdditionalAttachments;
