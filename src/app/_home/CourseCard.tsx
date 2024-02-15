"use client";

import React, { useContext } from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CourseActions from "./CourseActions";
import { Course } from "@/classes/course/course";
import DeleteButton from "./DeleteButton";
import { UserContext } from "@/contexts/UserContext";

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
