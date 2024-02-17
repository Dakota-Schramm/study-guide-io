"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { UserContext } from "@/contexts/UserContext";

type DownloadGuideOptions = {
  courseName: string,
  pdfName: string,
}

// TODO: Add other course types in future
// - Writing/Humanities?
export default function CreateContent() {
  const { user } = useContext(UserContext);

  const router = useRouter();

  // TODO: Move into middleware?
  if (user?.config === undefined) {
    if (window) window.location.href = "/permissions";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formValues = new FormData(e.target);

    const pdfs = formValues.get("pdfs");
    const attachments = formValues.get("attachments");

    const courseName = formValues.get("course-name");
    const fileName = formValues.get("pdf-name");
    if (!courseName) {
      alert("No course name provided!");
      return
    } else if (!fileName) {
      alert("No filename provided");
      return;
    }
    const options = { courseName, fileName };

    if (!pdfs || pdfs.length < 1) {
      alert("PDFs provided not sufficient");
      return;
    }

    if (!attachments || attachments.length < 1) {
      alert("Attachmentss provided not sufficient");
      return;
    }

    await user?.config?.downloadGuideToFileSystem(pdfs, attachments, options);
    router.push("/courses");
  }

  return (
    <>
      <h1>Create Guide</h1>
      <form id="pdf-create" className="flex flex-col space-y-4" onSubmit={handleSubmit}>
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
        <Button>Submit</Button>
      </form>
    </>
  );
}
