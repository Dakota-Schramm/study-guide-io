"use client";

import React, { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";
import { STEMCourse } from "../../classes/course";
import { CourseCard } from "./CourseCard";

export const PersonalView = () => {
  const { user } = useContext(UserContext);
  const { stem } = dean;

  return (
    <div className="grid grid-cols-3 gap-8">
      {stem.courses.map((course: STEMCourse) => (
        <CourseCard
          key={course.id}
          title={course.getName()}
          files={course.getFiles()?.length ?? 0}
        />
      ))}
    </div>
  );
};
