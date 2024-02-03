"use client";

import React, { useEffect, useRef, useState } from "react";

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

// TODO: Change this to not show courseNameInput when just downloading file directly
const CourseInitialization = ({ rendered, hidden, handleNextStep }) => {
  if (!rendered) return;

  // TODO: Add suggestions based on previous course names
  // https://www.geeksforgeeks.org/how-to-display-suggestions-for-input-field-in-html/

  return (
    <div hidden={hidden}>
      <label>
        Course Name
        <input id="courseNameInput" placeholder="Mathematics" type="text" />
      </label>
      <label>
        PDF Name
        <input id="pdfNameInput" placeholder="Mathematics" type="text" />
      </label>
      <button
        type="button"
        onClick={() => {
          const cName = document.getElementById("courseNameInput")?.value;
          const pName = document.getElementById("pdfNameInput")?.value;
          handleNextStep(cName, pName);
        }}
      >
        Start
      </button>
    </div>
  );
};

const TOTAL_STEPS = 5;

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
  const [guideProgress, setGuideProgress] = useState({
    step: 0,
    courseName: undefined,
    pdfName: undefined,
  });
  const { step } = guideProgress;

  const pdfRef = useRef(null);
  const attachmentRef = useRef(null);
  const downloadRef = useRef(null);

  function handlePrevStep() {
    setGuideProgress((s) => ({
      ...s,
      step: s.step - 1,
    }));
  }

  function handleNextStep() {
    setGuideProgress((s) => ({
      ...s,
      step: s.step + 1,
    }));
  }

  const components = {
    pdfFiles: (pdfRef?.current as HTMLInputElement)?.files ?? [],
    attachmentFiles: (attachmentRef?.current as HTMLInputElement)?.files ?? [],
    courseName: guideProgress.courseName,
    fileName: guideProgress.pdfName,
  };

  return (
    <>
      <form id="pdf-create" className="flex flex-col">
        {/* Steps */}
        <Start hidden={step !== 0} {...{ handleNextStep }} />
        <CourseInitialization
          rendered={1 <= step}
          hidden={2 <= step}
          handleNextStep={(course, pdf) => {
            setGuideProgress((prev) => ({
              step: prev.step + 1,
              courseName: course,
              pdfName: pdf,
            }));
          }}
        />
        <PdfUploader
          ref={pdfRef}
          rendered={2 <= step}
          hidden={3 <= step}
          {...{ handleNextStep }}
        />
        <AdditionalAttachments
          ref={attachmentRef}
          rendered={3 <= step}
          hidden={4 <= step}
          {...{ handlePrevStep, handleNextStep }}
        />
        <Finalize
          ref={downloadRef}
          rendered={3 <= step}
          hidden={step !== 4}
          {...{ components, handlePrevStep }}
        />
      </form>
      <StepStatus currentStep={step} totalSteps={TOTAL_STEPS} />
    </>
  );
};

export default GuideCreationProcess;
