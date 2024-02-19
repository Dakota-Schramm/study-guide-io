"use client";

import React, { useContext, useState } from "react";
import { z } from "zod";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UserContext } from "@/contexts/UserContext";

const formSchema = z.object({
  notes: z.string(),
});

type ExamDialogProps = {
  courseName: string;
  files: FileSystemFileHandle[];
  status: string;
  handleClick: () => void;
};

export const ExamDialog = ({ courseName, files, handleClick }: ExamDialogProps) => {
  const { user } = useContext(UserContext);
  const { courses } = user;

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const examsToAdd = Array.from(formData.values());

    // TODO: Add requirement that courseNames are unique
    const course = courses?.find((c) => c.getName() === courseName);
    if (!course) {
      throw new Error(
        `Course could not be found with courseName: ${courseName}`,
      );
    }

    window.log.info(
      `Creating exam for ${course.getName()} with files: ${examsToAdd.join(", ")}`,
    );
    await course.assignFilesToExam(examsToAdd);
  }

  // Dialog included inparent component
  return (
    <>
      <DialogTrigger onClick={handleClick}>Add Exam</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an Exam</DialogTitle>
          <DialogDescription>
            Select from the following list to choose which files to associate
            with this course:
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {files.map((f, idx) => (
            <FileListItem
              key={`${f.name}~${new Date().getTime()}`}
              name={f.name}
            />
          ))}
          <DialogClose asChild>
            <button type="submit">Create exam</button>
          </DialogClose>
        </form>
      </DialogContent>
    </>
  );
};

function FileListItem({ name }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox name="notes" value={name} id={name} />
      <Label htmlFor={name}>{name}</Label>
    </div>
  );
}
