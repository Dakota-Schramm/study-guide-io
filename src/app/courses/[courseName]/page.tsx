"use client";

import React, { useContext, useEffect, useState } from "react";
import { notFound, usePathname } from "next/navigation";

import { UserContext } from "@/contexts/UserContext";
import { ExamSection } from "./ExamSection";
import { FileSection } from "./FileSection";
import { Separator } from "@/components/ui/separator";

type CourseDetails = {
  exams?: string[][];
  files?: unknown[];
};

const SingleCoursePage = ({ params }: { params: { courseName: string } }) => {
  const { courseName } = params;
  const { user } = useContext(UserContext);
  const [details, setDetails] = useState<CourseDetails>({
    exams: undefined,
    files: undefined,
  });
  const { exams, files } = details;

  useEffect(() => {
    async function setupDetails() {
      const exams = await course?.getExams();
      const files = await course?.getCourseFiles();

      setDetails({ exams, files });
    }
    setupDetails();
  }, []);

  if (user?.courses === undefined) {
    if (window) window.location.href = "/permissions";
  }

  const course = user.courses?.find(
    (course) => course.getName() === courseName,
  );

  if (!course) notFound();

  return (
    <>
      <h1 className="col-span-2 lg:col-span-4">{course.getName()}</h1>
      <div className="container space-y-16 col-span-2 lg:col-span-4">
        <FileSection {...{ files, courseName }} />
        <Separator />
        <ExamSection {...{ exams, courseName }} />
      </div>
    </>
  );
};

export default SingleCoursePage;
