"use client";

import React, { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";
import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type PDFComponents = {
  pdfFiles: FileList;
  attachmentFiles: FileList;
  courseName: string;
  fileName: string;
};

type FinalizeProps = {
  rendered: boolean;
  hidden: boolean;
  components: PDFComponents;
  handlePrevStep: () => void;
};

// TODO: Change name of downloaded file
export const Finalize = ({
  rendered,
  hidden,
  components,
  handlePrevStep,
}: FinalizeProps) => {
  const { user } = useContext(UserContext);
  const router = useRouter();
  // console.log(`Finalize hidden: ${hidden}`);

  if (!rendered) return;

  const files = {
    pdfFiles: components?.pdfFiles,
    attachmentFiles: components?.attachmentFiles,
  };
  const courseName = components.courseName;
  const fileName = components?.fileName || "test.pdf";

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
    <div className={hidden ? "invisible" : undefined}>
      <h2>Finalize</h2>
      <p>Does this look good to you? If so, click "Complete"</p>
      <Button type="button" onClick={handlePrevStep}>
        Previous
      </Button>
      <Button data-testid="downloadGuide" type="button" onClick={handleSubmit}>
        Complete
      </Button>
    </div>
  );
};
