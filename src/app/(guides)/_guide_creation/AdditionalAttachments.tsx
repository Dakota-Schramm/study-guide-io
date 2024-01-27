"use client";
import React, { forwardRef } from "react";

const AdditionalAttachments = forwardRef(
  function AdditionalAttachments(props, ref) {
    const { hidden, handlePrevStep, handleNextStep } = props;

    return (
      <div className={hidden ? "invisible" : undefined}>
        <h2>Add any additional attachments</h2>
        <input
          ref={ref}
          name="attachments"
          type="file"
          accept="image/*"
          multiple
        />
        <button type="button" onClick={handlePrevStep}>
          Previous
        </button>
        <button type="button" onClick={handleNextStep}>
          Next
        </button>
      </div>
    );
  },
);

module.exports = {
  AdditionalAttachments,
};
