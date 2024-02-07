"use client";

import React, { useContext, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ExamDialog } from "./ExamDialog";
import { UserContext } from "@/contexts/UserContext";
import { BaseCourse, STEMCourse } from "@/classes/course";
import { ExamEditListItem } from "./ExamEditListItem";

// TODO: Make "Edit" button open disclosure exam edit is in
const ExamEditList = ({ exams }) => {
  console.log({ exams })
  if (exams === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {exams.map((exam, idx) => (
        <ExamEditListItem
          key={`${idx}~${new Date().getTime()}`}
          {...{ exam, idx }}
        />
      ))}
    </>
  );
};

type EditPopoverProps = {
  courseName: string;
  files: FileSystemFileHandle[];
  exams?: unknown[];
};

/**
 * @returns Edit popover for a course
 */
const EditPopover = ({ courseName, files, exams }: EditPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="p-2 text-white border border-solid border-gray-500 bg-yellow-500"
        >
          Edit
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <ExamDialog {...{ courseName, files }} />
        <ExamEditList {...{ exams }} />
      </PopoverContent>
    </Popover>
  );
};

export const CourseCard = ({ course }: { course: BaseCourse }) => {
  const [exams, setExams] = useState(undefined);

  const courseName = course.getName();
  const files = course.getCourseFiles();
  const type = getTypeOfCourse(course);

  useEffect(() => {
    async function getExams() {
      const exams = await course.getExams();
      setExams(exams);
    }
    getExams();
  }, [course]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{courseName}</CardTitle>
        <CardDescription>{type} Course</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{files.length ?? 0} files available</p>
      </CardContent>
      <CardFooter className="space-x-4">
        <button
          type="button"
          className="p-2 text-white border border-solid border-gray-500 bg-blue-500"
        >
          Open
        </button>
        <EditPopover {...{ courseName, files, exams }} />
        <button
          type="button"
          className="p-2 text-white border border-solid border-gray-500 bg-red-500"
        >
          Delete
        </button>
      </CardFooter>
    </Card>
  );
};

function getTypeOfCourse(course: BaseCourse) {
  let type: string = "";
  if (course instanceof STEMCourse) {
    type = "STEM";
  }

  return type;
}
