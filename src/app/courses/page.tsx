"use client";

import React, { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";
import { CourseCard } from "../_home/CourseCard";

const CoursesPage = () => {
  const { user } = useContext(UserContext);

  if (!user?.courses) {
    if (window) window.location.href = "/";
  }

  return (
    <div className="grid grid-cols-3 gap-8">
      {user?.courses?.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CoursesPage;
