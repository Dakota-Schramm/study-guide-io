"use client";

import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";

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
import { ExamEditListItem } from "./ExamEditListItem";
import CourseActions from "./CourseActions";
import { Course } from "@/classes/course/course";
import DeleteButton from "./DeleteButton";
import { UserContext } from "@/contexts/UserContext";

const ExamEditList = ({ course }: { course: Course }) => {
  const [exams, setExams] = useState<string[][] | undefined>(undefined);

  useEffect(() => {
    async function getExams() {
      const exams = await course.getExams();
      setExams(exams);
    }
    getExams();
  }, [course]);

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
const EditPopover = ({ course }: { course: Course }) => {
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

export const CourseCard = ({ course }: { course: Course }) => {
  const { user } = useContext(UserContext);

  const courseName = course.getName();
  const files = course.getCourseFiles();
  const type = course.type;

  return (
    <Card>
      <CardHeader>
        <Link href={`/courses/${course.getName()}`}>
          <CardTitle>{courseName}</CardTitle>
        </Link>
        <CardDescription>{type} Course</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{files?.length ?? 0} files available</p>
      </CardContent>
      <CardFooter className="space-x-4">
        <CourseActions course={course} />
        <EditPopover course={course} />
        {/* TODO: Rerender after delete action */}
        <DeleteButton
          courseName={courseName}
          handleConfirm={async () => {
            const parentHandle = user.config
              ?.getCourseTypeHandles()
              .find(([type, handle]) => type === course.type)?.[1] as
              | FileSystemDirectoryHandle
              | undefined;

            await parentHandle?.removeEntry(courseName, { recursive: true });
          }}
        />
      </CardFooter>
    </Card>
  );
};
