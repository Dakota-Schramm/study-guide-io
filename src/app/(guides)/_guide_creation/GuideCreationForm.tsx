import React, { useContext, useState, Children } from "react";
import { useRouter } from "next/navigation";

import { FullAccessUserConfig } from "@/classes/config/user/full-access";

import { Button } from "@/components/ui/button";

import { UserContext } from "@/contexts/UserContext";

const GuideCreationForm = ({ children }) => {
  const { user } = useContext(UserContext);
  const [guideProgress, setGuideProgress] = useState({
    step: 0,
    courseName: undefined,
    pdfName: undefined,
  });
  const { step } = guideProgress;

  const router = useRouter();

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

  async function handleSubmit() {
    if (user?.config instanceof FullAccessUserConfig) {
      await user?.config.downloadGuideToFileSystem(files, courseName, fileName);
    } else {
      await user?.config?.downloadGuideToFileSystem(
        components?.pdfFiles,
        components?.attachmentFiles,
        { courseName, fileName },
      );
    }
    router.push("/courses");
  }

  return (
    <>
      <form id="pdf-create" className="flex flex-col" onSubmit={handleSubmit}>
        {Children.map(children, (_, idx) => {
          if (idx === step) {
            return children[idx];
          }
          return undefined;
        })}
        <PrevButton onClick={handlePrevStep} {...{ step }} />
        <NextButton onClick={handleNextStep} {...{ step }} />
      </form>
      <StepStatus currentStep={step} totalSteps={TOTAL_STEPS} />
    </>
  );
};

function PrevButton({ step, onClick }) {
  if (step === 0) return undefined;

  return <Button type="button" onClick={onClick}>Previous</Button>;
}

function NextButton({ step, onClick }) {
  let buttonText;

  if (step === 0) {
    buttonText = "Start";
  } else if (step === 5) {
    buttonText = "Finish";
  } else {
    buttonText = "Next";
  }

  return (
    <Button type='button' onClick={onClick}>
      {buttonText}
    </Button>
  );
}

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

export default GuideCreationForm;