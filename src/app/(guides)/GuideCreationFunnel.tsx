import React, { useState } from "react";
import PDFViewer from "./pdf_uploader";
import PdfWizard from "./PdfWizard";

const Start = ({ handleNextStep }) => {
  return (
    <div>
      <h2>Start Your Study Guide</h2>
      <button type="button" onClick={handleNextStep}>
        Start
      </button>
    </div>
  );
};

const GuideCreationFunnel = () => {
  const [step, setStep] = useState<number>(0);

  function handlePrevStep() {
    setStep((s) => s - 1);
  }

  function handleNextStep() {
    setStep((s) => s + 1);
  }

  return [<Start {...{ handleNextStep }} />, <PdfWizard />][step];
};

export default GuideCreationFunnel;
