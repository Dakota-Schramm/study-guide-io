"use client";

import { DeanContext } from "@/contexts/DeanContext";
import React, { useContext, useEffect } from "react";
import { PersonalView } from "./PersonalView";
import { BaseCourse } from "./course";

// TODO: Replce with window.locatio.hash or URLSearchParams(window.location.href)
// TODO: Fix so Create doesnt display until settings setup
// TODO: Use OPFS as fallback if user says no to showing directory
export const HomeContent = ({
  handleClick,
}: {
  handleClick: (newLocation: string) => void;
}) => {
  const { dean } = useContext(DeanContext);
  const { stem } = dean;

  useEffect(() => {
    console.log(`Home courses: ${stem?.courses}`);
  }, [stem?.courses]);

  return {
    personal: <PersonalView />,
    basic: <BasicView handleClick={handleClick} />,
    newUser: <NewUserView />,
  }[checkPageType(stem?.courses)];
};

function NewUserView() {
  const { dean, reSyncCourses } = useContext(DeanContext);
  const { stem } = dean;

  if (stem !== undefined) {
    throw new Error(
      `Unreachable state met => StemLength: ${stem?.courses?.length}`,
    );
  }

  return (
    <>
      <div>Placeholder image...</div>
      <h2>We need some things from you to get started...</h2>

      <button type="button" onClick={reSyncCourses}>
        Setup permissions
      </button>
    </>
  );
}

function BasicView({
  handleClick,
}: {
  handleClick: (newLocation: string) => void;
}) {
  const { dean } = useContext(DeanContext);
  const { stem } = dean;

  if (stem?.courses?.length !== 0) {
    throw new Error(`Unreachable state met => StemLength: ${stem?.length}`);
  }

  return (
    <>
      <button type="button" onClick={() => handleClick("create")}>
        Create
      </button>
      <button type="button" onClick={() => handleClick("settings")}>
        Settings
      </button>
    </>
  );
}

function checkPageType(courses: BaseCourse[] | undefined) {
  let index: "personal" | "basic" | "newUser";

  if (typeof courses === "undefined") index = "newUser";
  else if (courses.length) index = "personal";
  else index = "basic";

  return index;
}
