import React, { useContext, useState, Children, createContext } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { UserContext } from "@/contexts/UserContext";

type FormState = {
  step: number;
  courseName?: string;
  pdfName?: string;
  pdfs: FileList;
  attachments: FileList;
};

type FormContextProps = {
  form: FormState;
  setForm: (form: FormState) => void;
};

export const FormContext = createContext<FormContextProps>({
  form: {
    step: 0,
    courseName: undefined,
    pdfName: undefined,
    pdfs: [],
    attachments: [],
  },
  setForm: (form) => {},
});

/**
 * The provider that handles globals for the app
 */
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [form, setForm] = useState({
    step: 0,
    courseName: undefined,
    pdfName: undefined,
    pdfs: [],
    attachments: [],
  });

  return (
    <FormContext.Provider value={{ form, setForm }}>
      {children}
    </FormContext.Provider>
  );
};

const GuideCreationForm = ({ children }) => {
  const { user } = useContext(UserContext);
  const { form, setForm } = useContext(FormContext);
  const { step } = form;

  const router = useRouter();

  function handlePrevStep() {
    setForm((s) => ({
      ...s,
      step: s.step - 1,
    }));
  }

  function handleNextStep() {
    setForm((s) => ({
      ...s,
      step: s.step + 1,
    }));
  }

  // TODO: Move validations into form steps
  // Add stepIsValid boolean that returns whether inputs on page are valid
  // Use to allow going to next step
  async function handleSubmit(e) {
    const { pdfs, attachments, courseName, pdfName } = form;
    const options = { courseName, fileName: pdfName };

    console.log({ form });
    e.preventDefault();

    let isFormValid = true;
    if ((pdfs ?? []).length === 0) {
      alert("Must include pdfs in form");
      isFormValid = false;
    }

    if (courseName === undefined) {
      alert("Must include courseName");
      isFormValid = false;
    }

    if (pdfName === undefined) {
      alert("Must include fileName");
      isFormValid = false;
    }

    if (!isFormValid) {
      return;
    }

    await user?.config?.downloadGuideToFileSystem(pdfs, attachments, options);

    router.push("/courses");
  }

  return (
    <>
      <form id="pdf-create" className="flex flex-col" onSubmit={handleSubmit}>
        {Children.map(children, (child, idx) => {
          if (idx === step) {
            return child;
          }
          return undefined;
        })}
        <PrevButton onClick={handlePrevStep} {...{ step }} />
        <NextButton onClick={handleNextStep} {...{ step }} />
        <SubmitButton {...{ step }} />
      </form>
      <StepStatus currentStep={step} totalSteps={TOTAL_STEPS} />
    </>
  );
};

function PrevButton({ step, onClick }) {
  if (step === 0) return undefined;

  return (
    <Button type="button" onClick={onClick}>
      Previous
    </Button>
  );
}

// TODO: Add ability to disable button if form info is missing or invalid
function NextButton({ step, onClick }) {
  let buttonText;
  if (step === 4) return undefined;

  if (step === 0) {
    buttonText = "Start";
  } else {
    buttonText = "Next";
  }

  return (
    <Button type="button" onClick={onClick}>
      {buttonText}
    </Button>
  );
}

function SubmitButton({ step }) {
  if (step !== 4) return undefined;

  return <Button type="submit">Complete</Button>;
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
