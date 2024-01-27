"use client";
import React from "react";

export const AdditionalAttachments = ({
  hidden,
  handlePrevStep,
  handleNextStep,
}) => {
  console.log(`AdditionalAttachments hidden: ${hidden}`);

  return (
    <div className={hidden ? "invisible" : undefined}>
      <h2>Add any additional attachments</h2>
      <input name="attachments" type="file" accept="image/*" multiple />
      <button type="button" onClick={handlePrevStep}>
        Previous
      </button>
      <button type="button" onClick={handleNextStep}>
        Next
      </button>
    </div>
  );
};
