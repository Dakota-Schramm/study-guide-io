"use client";

import React, { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";
import { CourseCard } from "./CourseCard";

export const PersonalView = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="grid grid-cols-3 gap-8">
      {user?.courses?.map((course) => (
        <CourseCard
          key={course.id}
          courseName={course.getName()}
          files={course.getCourseFiles()}
        />
      ))}
    </div>
  );
};
