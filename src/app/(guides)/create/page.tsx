"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UserContext } from "@/contexts/UserContext";
import {
  downloadGuideToFileSystem,
  downloadToBrowser,
} from "@/lib/browserDownloadHelpers";
import TextInput from "./TextInput";
import UploadPDFButton from "./UploadPDFButton";
import UploadAttachmentsButton from "./UploadAttachmentsButton";

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

// Add isOpen state to open and close popovers
// TODO: Figure out how to handle when attachments aren't present
const SubmitButton = ({ formData }) => {
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
        <Button className="w-full" type="submit">
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

// TODO: Add other course types in future
// - Writing/Humanities?
// ? Maybe make the file inputs just icon btns?
// Add additional validation check to see if pdfname already exists
// TODO: Change buttons to fill svg color based on state
export default function CreateContent() {
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  return (
    <Card className="border-4 border-solid py-8 px-16">
      <CardHeader>
        <CardTitle>Create Guide</CardTitle>
        <CardDescription>...</CardDescription>
      </CardHeader>
      <form
        id="pdf-create"
        className="flex flex-col space-y-4 w-full h-full"
        onSubmit={(e) => {
          e.preventDefault();
          setFormData(new FormData(e.target));
        }}
      >
        <CardContent>
          <TextInput
            labelText="Course Name"
            name="course-name"
            placeholder="Mathematics"
          />
          <TextInput
            labelText="PDF Name"
            name="pdf-name"
            placeholder="lecture-1"
          />
        </CardContent>
        <CardFooter className="grid grid-cols-4 gap-8">
          <UploadPDFButton />
          <UploadAttachmentsButton />
          <div className="col-span-2">
            <SubmitButton {...{ formData }} />
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
