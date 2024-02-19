"use client";

import React, { useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const { user, setupPermissions, setupConfig, } = useContext(UserContext);

  return (
    <Button
      type="button"
      onClick={() => {
        const newUser = setupConfig();
        setupPermissions(newUser.config)
          .then(onClick)
          .catch(() => {});
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

// Add isOpen state to open and close popovers
// TODO: Figure out how to handle when attachments aren't present
const SubmitButton = ({ formData }) => {
  const [isOpen, setIsOpen] = useState(formData !== undefined);
  const { user } = useContext(UserContext);

  const router = useRouter();

  const handlePrimaryAction = useCallback(
    async () => {
      setIsOpen(false);

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
      if (!courseHandle) throw new Error(`Course handle not found: ${courseName}`);

      const files = { pdfFiles: pdfs, attachmentFiles: attachments };
      const options = { courseName, fileName };
      await downloadGuideToFileSystem(courseHandle, files, options);

      router.push("/courses");
    },
    [user?.config, formData],
  )
  
  const handleDownload = useCallback(
    () => {
      setIsOpen(false);
      const pdfs = formData.getAll("pdfs");
      const attachments = formData.getAll("attachments");
      downloadToBrowser(pdfs, attachments);
    },
    [formData],
  )

  let primaryBtn;
  if (user.config === undefined) {
    primaryBtn = <PermissionsButton onClick={handlePrimaryAction} />;
  } else {
    primaryBtn = <AddToCoursesButton onClick={handlePrimaryAction} />;
  }

  // TODO: Make these a radio btn?
  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button type="submit" onClick={(event) => {
          if (formData !== undefined) event.preventDefault();
          if (!formData) return;
          setIsOpen((prev) => !prev)
        }}>Submit</Button>
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

// TODO: Add other course types in future
// - Writing/Humanities?
// ? Maybe make the file inputs just icon btns?
// Add additional validation check to see if pdfname already exists
export default function CreateContent() {
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  return (
    <>
      <h1>Create Guide</h1>
      <form
        id="pdf-create"
        className="flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setFormData(new FormData(e.target));
        }}
      >
        <Label>
          Course Name
          <Input
            id="course-name"
            name="course-name"
            placeholder="Mathematics"
            type="text"
            required
            minLength={2}
          />
        </Label>
        <Label>
          PDF Name
          <Input
            id="pdf-name"
            name="pdf-name"
            placeholder="lecture-1"
            type="text"
            required
            minLength={2}
          />
        </Label>
        <Label>
          Upload PDFs:
          <Input
            id="pdfs"
            name="pdfs"
            type="file"
            accept=".pdf"
            multiple
            required
          />
        </Label>
        <Label>
          Upload images:{" "}
          <Input
            id="attachments"
            name="attachments"
            type="file"
            accept=".png, .jpg"
            multiple
          />
        </Label>
        <SubmitButton {...{ formData }} />
      </form>
    </>
  );
}
