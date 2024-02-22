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

// TODO: Add other course types in future
// - Writing/Humanities?
// ? Maybe make the file inputs just icon btns?
// Add additional validation check to see if pdfname already exists
// TODO: Change buttons to fill svg color based on state
export default function CreatePage() {
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  return (
    <Card className="border-4 border-solid py-8 px-16 w-10/12 h-full">
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
