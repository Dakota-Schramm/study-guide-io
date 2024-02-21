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
      <div className="flex flex-col lg:flex-row space-y-16 lg:space-y-0 col-span-2 lg:col-span-4 space-x-0 lg:space-x-4">
        <div className="w-1/2">
          <FileSection {...{ files, courseName }} />
        </div>
        <Separator orientation="vertical" />
        <div className="w-1/2">
          <ExamSection {...{ exams, courseName }} />
        </div>
      </div>
    </>
  );
};

export default SingleCoursePage;
