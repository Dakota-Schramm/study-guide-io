"use client";
import React from "react";

export const Finalize = ({ hidden, handlePrevStep, handleSubmit }) => {
  console.log(`Finalize hidden: ${hidden}`);
  return (
    <div className={hidden ? "invisible" : undefined}>
      <h2>Finalize</h2>
      <p>Does this look good to you? If so, click "Complete"</p>
      <button type="button" onClick={handlePrevStep}>
        Previous
      </button>
      <button type="button" onClick={handleSubmit}>
        {" "}
        Complete{" "}
      </button>
    </div>
  );
};
