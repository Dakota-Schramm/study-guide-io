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
import { BaseCourse, STEMCourse } from "@/classes/course";
import { ExamEditListItem } from "./ExamEditListItem";
import CourseActions from "./CourseActions";

const ExamEditList = ({ course }: { course: BaseCourse }) => {
  const [exams, setExams] = useState<string[][] | undefined>(undefined);

  useEffect(() => {
    async function getExams() {
      const exams = await course.getExams();
      setExams(exams);
    }
    getExams();
  }, []);

  if (exams === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {exams.map((exam, idx) => (
        <ExamEditListItem
          key={`${idx}~${new Date().getTime()}`}
          handleDelete={async () => {
            const remainingExams = await course.deleteExam(idx);
            setExams(remainingExams);
          }}
          {...{ exam, idx }}
        />
      ))}
    </>
  );
};

/**
 * @returns Edit popover for a course
 */
const EditPopover = ({ course }: { course: BaseCourse }) => {
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
        <ExamDialog
          courseName={course.getName()}
          files={course.getCourseFiles()}
        />
        <ExamEditList {...{ course }} />
      </PopoverContent>
    </Popover>
  );
};

export const CourseCard = ({ course }: { course: BaseCourse }) => {
  const courseName = course.getName();
  const files = course.getCourseFiles();
  const type = getTypeOfCourse(course);

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
        <CourseActions course={course} />
        <EditPopover course={course} />
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
  let type = "";
  if (course instanceof STEMCourse) {
    type = "STEM";
  }

  return type;
}
