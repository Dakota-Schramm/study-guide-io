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

//? Maybe replace with https://ui.shadcn.com/docs/components/progress ?
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
  const downloadRef = useRef(null);

  function handlePrevStep() {
    setStep((s) => s - 1);
  }

  function handleNextStep() {
    setStep((s) => s + 1);
  }

  return (
    <>
      <form id="pdf-create" className="flex flex-col">
        {/* Steps */}
        <Start hidden={step !== 0} {...{ handleNextStep }} />
        <PdfUploader
          ref={pdfRef}
          rendered={1 <= step}
          hidden={2 <= step}
          {...{ handleNextStep }}
        />
        <AdditionalAttachments
          ref={attachmentRef}
          rendered={2 <= step}
          hidden={3 <= step}
          {...{ handlePrevStep, handleNextStep }}
        />
        <Finalize
          ref={downloadRef}
          rendered={3 <= step}
          hidden={step !== 3}
          pdfFiles={(pdfRef?.current as HTMLInputElement)?.files ?? []}
          attachmentFiles={
            (attachmentRef?.current as HTMLInputElement)?.files ?? []
          }
          {...{ handlePrevStep }}
        />
      </form>
      <StepStatus currentStep={step} totalSteps={TOTAL_STEPS} />
    </>
  );
};

export default GuideCreationProcess;
