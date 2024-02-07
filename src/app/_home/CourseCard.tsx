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

/* TODO: User should be able to...
    - create exams
    - download "study guides" for the exams
    - download a final exam study guide
*/
/* Feature ideas
    - study guides build based on questions user has gone over and gotten right /wrong
    - integrate with anki??
*/

const ExamEditListItem = ({ exam, idx }) => {
  return (
    <div className="flex">
      <p>Exam {idx}</p>
      <button>View</button>
      <button>Delete</button>
    </div>
  );
};

// TODO: Make "Edit" button open disclosure exam edit is in
const ExamEditList = ({ exams }) => {
  if (exams === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {exams.map((exam, idx) => (
        <ExamEditListItem {...{ exam, idx }} />
      ))}
    </>
  );
};

type CourseSyllabusProps = {
  courseName: string;
  files: FileSystemFileHandle[];
  exams?: unknown[];
};

/**
 * @returns Edit popover for a course
 */
const CourseSyllabus = ({ courseName, files, exams }: CourseSyllabusProps) => {
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
  }, []);

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
        <CourseSyllabus {...{ courseName, files, exams }} />
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
  let type;
  if (course instanceof STEMCourse) {
    type = "STEM";
  }

  return type;
}
