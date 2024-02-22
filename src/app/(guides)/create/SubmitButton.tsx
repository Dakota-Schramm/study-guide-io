"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserContext } from "@/contexts/UserContext";
import {
  downloadGuideToFileSystem,
  downloadToBrowser,
} from "@/lib/browserDownloadHelpers";

const PermissionsButton = ({ onClick }) => {
  const { user, setupPermissions } = useContext(UserContext);

  return (
    <Button
      type="button"
      onClick={async () => {
        await setupPermissions();
        await onClick();
      }}
    >
      Setup Permissions
    </Button>
  );
};

const AddToCoursesButton = ({ onClick }) => (
  <Button type="button" {...{ onClick }}>
    Add to Courses
  </Button>
);

// SUBMIT BUTTON STATES
// User has no config
//   - Give user option to allow permissions
//   - Download into downloads folder
// User has config
//   - Download into storage
//   - Download into downloads folder

export type SubmitButtonProps = {
  formData?: FormData;
  isValid?: boolean;
};

// Add isOpen state to open and close popovers
// TODO: Change button color based on formValidity
export const SubmitButton = ({ formData, isValid }: SubmitButtonProps) => {
  const { user } = useContext(UserContext);

  const router = useRouter();

  async function handlePrimaryAction() {
    const pdfs = formData.getAll("pdfs");
    const attachments = formData.getAll("attachments");
    const courseName = formData.get("course-name");
    const fileName = formData.get("pdf-name");

    const courseHandle = await user?.config?.findCourseHandle(
      "STEM",
      courseName,
      {
        create: true,
      },
    );
    if (!courseHandle) throw new Error("Course handle not found");

    const files = { pdfFiles: pdfs, attachmentFiles: attachments };
    const options = { courseName, fileName };
    await downloadGuideToFileSystem(courseHandle, files, options);

    router.push("/courses");
  }

  function handleDownload() {
    const pdfs = formData.getAll("pdfs");
    const attachments = formData.getAll("attachments");
    downloadToBrowser(pdfs, attachments);
  }

  let primaryBtn;
  if (user.config === undefined) {
    primaryBtn = <PermissionsButton onClick={handlePrimaryAction} />;
  } else {
    primaryBtn = <AddToCoursesButton onClick={handlePrimaryAction} />;
  }

  // TODO: Make these a radio btn?
  return (
    <Popover open={formData !== undefined}>
      <PopoverTrigger asChild>
        <Button
          variant={isValid === false ? "destructive" : undefined}
          className="w-full"
          type="submit"
        >
          Submit
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {primaryBtn}
        <Button type="button" onClick={handleDownload}>
          Download
        </Button>
      </PopoverContent>
    </Popover>
  );
};
