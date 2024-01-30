"use client";
import React, { forwardRef } from "react";

const AdditionalAttachments = forwardRef(function AdditionalAttachments(
  { hidden, handlePrevStep, handleNextStep },
  ref,
) {
  // TODO: Allow more file types in input[name="attachments"]
  return (
    <div className={hidden ? "invisible absolute" : undefined}>
      <h2>Add any additional attachments</h2>
      <label>
        Upload images:
        <input
          ref={ref}
          name="attachments"
          type="file"
          accept=".png"
          multiple
        />
      </label>
      <button type="button" onClick={handlePrevStep}>
        Previous
      </button>
      <button type="button" onClick={handleNextStep}>
        Next
      </button>
    </div>
  );
});

export default AdditionalAttachments;
