"use client";

import React, { useState } from "react";
import PdfUploader from "./pdf/PdfUploader";
import { Finalize } from "./Finalize";
import { AdditionalAttachments } from "./AdditionalAttachments";

const Start = ({ hidden, handleNextStep }) => {
  return (
    <div hidden={hidden}>
      <h2>Start Your Study Guide</h2>
      <button type="button" onClick={handleNextStep}>
        Start
      </button>
    </div>
  );
};

const TOTAL_STEPS = 4;

const StepStatus = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <>
      {Array.from(new Array(totalSteps), (_, index) => (
        <div className={index === currentStep ? "bg-red-700" : ""}>
          {index + 1}
        </div>
      ))}
    </>
  );
};

const GuideCreationProcess = () => {
  const [step, setStep] = useState<number>(0);

  function handlePrevStep() {
    setStep((s) => s - 1);
  }

  function handleNextStep() {
    setStep((s) => s + 1);
  }

  function handleSubmit() {
    console.log("submitted!");
  }

  return (
    <>
      <form id="pdf-create" className="flex flex-col">
        {/* Steps */}
        <Start hidden={step !== 0} {...{ handleNextStep }} />
        {1 <= step && (
          <PdfUploader hidden={2 <= step} {...{ handleNextStep }} />
        )}
        {2 <= step && (
          <AdditionalAttachments
            hidden={3 <= step}
            {...{ handlePrevStep, handleNextStep }}
          />
        )}
        {3 <= step && (
          <Finalize hidden={step !== 3} {...{ handlePrevStep, handleSubmit }} />
        )}
      </form>
      <StepStatus currentStep={step} totalSteps={TOTAL_STEPS} />
    </>
  );
};

export default GuideCreationProcess;
