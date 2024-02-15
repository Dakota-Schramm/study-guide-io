"use client";

import React, { useContext, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { UserContext } from "@/contexts/UserContext";
import { CourseCard } from "../_home/CourseCard";
import { RestrictedAccessUserConfig } from "@/classes/config/user/restricted-access";

const CoursesPage = () => {
  const { user, reSyncCourses } = useContext(UserContext);

  useEffect(() => {
    reSyncCourses();
  }, []);

  useEffect(() => {
    async function checkStorage() {
      if (user?.config instanceof RestrictedAccessUserConfig) {
        const { percentage, quota } = await user.config.estimateStorage();
        if (percentage < 80) return;

        toast("Space is limited!", {
          description: `You are using ${percentage}% of your ${quota} storage.`,
          action: {
            label: "OK",
            onClick: () => {},
          },
        });
      }
    }
    checkStorage();
  }, [user.config]);

  if (user?.config === undefined) {
    if (window) window.location.href = "/permissions";
  } else if (
    user?.config instanceof RestrictedAccessUserConfig &&
    user?.courses === undefined
  ) {
    return <div>User needs to download files to see courses</div>;
  }

  const noCourses = user?.courses?.length === 0;
  if (noCourses) {
    return (
      <div>
        <h1>No Courses</h1>
        <p>It looks like you don't have any courses yet.</p>
        <p>
          Add courses at{" "}
          <Link href="/courses">
            <span className="text-blue-400 underline">/courses</span>
          </Link>
          .
        </p>
      </div>
    );
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
