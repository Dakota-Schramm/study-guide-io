"use client";

import React, { useContext, useState } from "react";
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

// SUBMIT BUTTON STATES
// User has no config
//   - Give user option to allow permissions
//   - Download into downloads folder
// User has config
//   - Download into storage
//   - Download into downloads folder
const SubmitButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, } = useContext(UserContext);

  let primaryBtn;
  if (user.config === undefined) {
    primaryBtn = "permit-and-add";
  } else {
    primaryBtn = "add";
  }

  // TODO: Make these a radio btn?
  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button>Submit</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Button onClick={() => {
          setIsOpen(false)
        }}></Button>
        <Button onClick={() => {
        }}>Download</Button>
      </PopoverContent>
    </Popover>
  )
}

// TODO: Add other course types in future
// - Writing/Humanities?
// ? Maybe make the file inputs just icon btns?
export default function CreateContent() {
  const { user } = useContext(UserContext);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const formValues = new FormData(e.target);

    const pdfs = formValues.get("pdfs");
    const attachments = formValues.get("attachments");

    if (!pdfs || pdfs.length < 1) {
      alert("PDFs provided not sufficient");
      return;
    }

    if (!attachments || attachments.length < 1) {
      alert("Attachmentss provided not sufficient");
      return;
    }

    const downloadType = formValues.get('download-type');
    if (!downloadType) {
      alert("Download type not provided")
      return;
    } else if (downloadType === "download") {
      user?.config?.download(pdfs, attachments);
      return;
    }

    if (downloadType === "permit-and-add") {
      // determine config and init
    }

    const courseName = formValues.get("course-name");
    const fileName = formValues.get("pdf-name");
    if (!courseName) {
      alert("No course name provided!");
      return;
    }
    if (!fileName) {
      alert("No filename provided");
      return;
    }
    const options = { courseName, fileName };

    await user?.config?.downloadGuideToFileSystem(pdfs, attachments, options);
    router.push("/courses");
  }

  return (
    <>
      <h1>Create Guide</h1>
      <form
        id="pdf-create"
        className="flex flex-col space-y-4"
        onSubmit={handleSubmit}
      >
        <Label>
          Course Name
          <Input
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
            name="pdf-name"
            placeholder="lecture-1"
            type="text"
            required
            minLength={2}
          />
        </Label>
        <Label>
          Upload PDFs:
          <Input name="pdfs" type="file" accept=".pdf" multiple />
        </Label>
        <Label>
          Upload images:{" "}
          <Input name="attachments" type="file" accept=".png, .jpg" multiple />
        </Label>
        <SubmitButton />
      </form>
    </>
  );
}
