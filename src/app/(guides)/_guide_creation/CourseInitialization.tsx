"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// TODO: Add suggestions based on previous course names
// https://www.geeksforgeeks.org/how-to-display-suggestions-for-input-field-in-html/
export const CourseInitialization = () => {
  return (
    <>
      <Label>
        Course Name
        <Input id="courseNameInput" placeholder="Mathematics" type="text" />
      </Label>
      <Label>
        PDF Name
        <Input id="pdfNameInput" placeholder="Mathematics" type="text" />
      </Label>
    </>
  );
};
