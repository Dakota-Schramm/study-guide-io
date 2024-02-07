"use client";

import React from "react";

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

/* TODO: User should be able to...
    - create exams
    - download "study guides" for the exams
    - download a final exam study guide
*/
/* Feature ideas
    - study guides build based on questions user has gone over and gotten right /wrong
    - integrate with anki??
*/

type CourseSyllabusProps = {
  courseName: string;
  files: FileSystemFileHandle[];
};

/**
 * @returns Edit popover for a course
 */
const CourseSyllabus = ({ courseName, files }: CourseSyllabusProps) => {
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
      </PopoverContent>
    </Popover>
  );
};

type CourseCard = {
  type: Course;
  courseName: string;
  files: FileSystemFileHandle[];
};

export const CourseCard = ({ type, courseName, files }: CourseCard) => (
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
      <CourseSyllabus {...{ courseName, files }} />
      <button
        type="button"
        className="p-2 text-white border border-solid border-gray-500 bg-red-500"
      >
        Delete
      </button>
    </CardFooter>
  </Card>
);
