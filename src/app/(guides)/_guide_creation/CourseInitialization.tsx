"use client";

import React, { useContext } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FormContext } from "./GuideCreationForm";

// TODO: Add suggestions based on previous course names
// https://www.geeksforgeeks.org/how-to-display-suggestions-for-input-field-in-html/
export const CourseInitialization = () => {
  const { form, setForm } = useContext(FormContext);
  const { courseName, pdfName } = form;

  return (
    <>
      <Label>
        Course Name
        <Input
          placeholder="Mathematics"
          type="text"
          value={courseName}
          onChange={(e) => {
            setForm({ ...form, courseName: e.target.value });
          }}
        />
      </Label>
      <Label>
        PDF Name
        <Input
          placeholder="lecture-1"
          type="text"
          value={pdfName}
          onChange={(e) => {
            setForm({ ...form, pdfName: e.target.value });
          }}
        />
      </Label>
    </>
  );
};
