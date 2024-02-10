"use client";

import React, { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";
import { CourseCard } from "../_home/CourseCard";
import { RestrictedAccessUserConfig } from "@/classes/config/user/restricted-access";

const CoursesPage = () => {
  const { user } = useContext(UserContext);

  if (user?.config === undefined) {
    if (window) window.location.href = "/";
  } else if (user?.config instanceof RestrictedAccessUserConfig) {
    return <div>User needs to download files to see courses</div>;
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
