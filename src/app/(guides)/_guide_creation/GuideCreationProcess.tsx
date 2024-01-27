"use client";

import React, { useState } from "react";
import PdfWizard from "./PdfWizard";
import { Finalize } from "./Finalize";

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

const AdditionalAttachments = ({ hidden, handlePrevStep, handleNextStep }) => {
  console.log(`AdditionalAttachments hidden: ${hidden}`);

  return (
    <div className={hidden && "invisible"}>
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
        {1 <= step && <PdfWizard hidden={2 <= step} {...{ handleNextStep }} />}
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
