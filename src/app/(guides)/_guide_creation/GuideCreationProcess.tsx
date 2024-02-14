"use client";

import React, { useEffect, useRef, useState } from "react";

import PdfUploader from "./pdf/PdfUploader";
import { Finalize } from "./Finalize";
import AdditionalAttachments from "./AdditionalAttachments";
import { CourseInitialization } from "./CourseInitialization";

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

  // TODO: Create a Steps component that populates rendered and hidden based on child number
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
