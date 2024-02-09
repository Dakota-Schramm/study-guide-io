"use client";

import React, { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { UserContext } from "@/contexts/UserContext";
import { ExamSection } from "./ExamSection";
import { FileSection } from "./FileSection";

type CourseDetails = {
  exams?: string[][];
  files?: unknown[];
};

const SingleCoursePage = () => {
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
    if (window) window.location.href = "/";
  }

  const pathName = usePathname();

  const courseName = pathName.split("/").at(-1);
  const course = user.courses?.find(
    (course) => course.getName() === courseName,
  );

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div>
      <h1>{course.getName()}</h1>
      <ExamSection {...{ exams, courseName }} />
      <FileSection {...{ files, courseName }} />
    </div>
  );
};

export default SingleCoursePage;
