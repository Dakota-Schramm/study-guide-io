"use client";

import React, { forwardRef } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AdditionalAttachments = forwardRef(function AdditionalAttachments(
  { rendered, hidden, handlePrevStep, handleNextStep },
  ref,
) {
  if (!rendered) return;

  // TODO: Allow more file types in input[name="attachments"]
  return (
    <div className={hidden ? "invisible absolute" : undefined}>
      <h2>Add any additional attachments</h2>
      <Label>
        Upload images:
        <Input
          ref={ref}
          name="attachments"
          type="file"
          accept=".png, .jpg"
          multiple
        />
      </Label>
      <Button type="button" onClick={handlePrevStep}>
        Previous
      </Button>
      <Button type="button" onClick={handleNextStep}>
        Next
      </Button>
    </div>
  );
});

export default AdditionalAttachments;
