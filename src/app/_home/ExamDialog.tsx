"use client";

import React, { useContext } from "react";
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
};

export const ExamDialog = ({ courseName, files }: ExamDialogProps) => {
  const { addExamToCourse } = useContext(UserContext);

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const examsToAdd = Array.from(formData.values());

    addExamToCourse(courseName, examsToAdd);
  }

  return (
    <Dialog>
      <DialogTrigger>Add Exam</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an Exam</DialogTitle>
          <DialogDescription>
            Select from the following list to choose which files to associate
            with this course:
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {files.map((f) => (
            <FileListItem name={f.name} />
          ))}
          <DialogClose asChild>
            <button type="submit">Create exam</button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
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
