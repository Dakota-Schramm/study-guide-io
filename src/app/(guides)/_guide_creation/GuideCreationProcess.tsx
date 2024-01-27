"use client";

import React, { useRef, useState } from "react";
import PdfUploader from "./pdf/PdfUploader";
import { Finalize } from "./Finalize";
import AdditionalAttachments from "./AdditionalAttachments";

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
  const pdfRef = useRef(null);
  const attachmentRef = useRef(null);

  function handlePrevStep() {
    setStep((s) => s - 1);
  }

  function handleNextStep() {
    setStep((s) => s + 1);
  }

  function handleSubmit() {
    console.log("submitted =>", { pdfRef, attachmentRef });
    if (!pdfRef?.current || !attachmentRef?.current) return;

    const pdfFiles = pdfRef.current.files;
    const attachmentFiles = attachmentRef.current.files;

    console.log("Submitted files: ", [
      ...Array.from(pdfFiles),
      ...Array.from(attachmentFiles),
    ]);
  }

  return (
    <>
      <form id="pdf-create" className="flex flex-col">
        {/* Steps */}
        <Start hidden={step !== 0} {...{ handleNextStep }} />
        {1 <= step && (
          <PdfUploader
            ref={pdfRef}
            hidden={2 <= step}
            {...{ handleNextStep }}
          />
        )}
        {2 <= step && (
          <AdditionalAttachments
            ref={attachmentRef}
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
