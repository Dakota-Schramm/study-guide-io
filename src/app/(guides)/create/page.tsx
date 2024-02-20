"use client";

import React, { useContext, useEffect, useRef, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TextInput from "./TextInput";
import UploadPDFButton from "./UploadPDFButton";
import UploadAttachmentsButton from "./UploadAttachmentsButton";
import { SubmitButton } from "./SubmitButton";
import {
  downloadGuideToFileSystem,
  downloadToBrowser,
} from "@/lib/browserDownloadHelpers";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";
import CourseNameInput from "./CourseNameInput";

// TODO: Add other course types in future
// - Writing/Humanities?
// ? Maybe make the file inputs just icon btns?
// Add additional validation check to see if pdfname already exists
// TODO: Change buttons to fill svg color based on state
export default function CreatePage() {
  const [formInteractionResult, setFormInteractionResult] = useState<
    "open" | "close" | undefined
  >(undefined);
  const { user, setupPermissions } = useContext(UserContext);
  const formRef = useRef<HTMLFormElement>(null);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ e }, e.submitter);
    const formData = new FormData(e.target);

    const pdfs = formData.getAll("pdfs");
    const attachments = formData.getAll("attachments");

    const submitterValue = e.nativeEvent.submitter.value;
    if (submitterValue === "Download") {
      downloadToBrowser(pdfs, attachments);
      return;
    }
    if (submitterValue === "Setup Permissions") {
      await setupPermissions();
    }
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

  return (
    <Card className="w-10/12 h-full px-16 py-8 border-4 border-solid">
      <CardHeader>
        <CardTitle>Create Guide</CardTitle>
        <CardDescription>...</CardDescription>
      </CardHeader>
      <form
        id="pdf-create"
        ref={formRef}
        className="flex flex-col w-full h-full space-y-4"
        onSubmit={handleSubmit}
      >
        <CardContent>
          <CourseNameInput />
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
            <SubmitButton />
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
