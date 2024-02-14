"use client";

import React, { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";
import GuideCreationForm, {
  FormProvider,
} from "../_guide_creation/GuideCreationForm";
import Start from "../_guide_creation/Start";
import { CourseInitialization } from "../_guide_creation/CourseInitialization";
import PdfUploader from "../_guide_creation/pdf/PdfUploader";
import AdditionalAttachments from "../_guide_creation/AdditionalAttachments";
import { Finalize } from "../_guide_creation/Finalize";

// TODO: Add other course types in future
// - Writing/Humanities?
export default function CreateContent() {
  const { user } = useContext(UserContext);

  // TODO: Move into middleware?
  if (user?.config === undefined) {
    if (window) window.location.href = "/permissions";
  }

  return (
    <>
      <h1>Create Guide</h1>
      <FormProvider>
        <GuideCreationForm>
          <Start />
          <CourseInitialization />
          <PdfUploader />
          <AdditionalAttachments />
          <Finalize />
        </GuideCreationForm>
      </FormProvider>
    </>
  );
}
