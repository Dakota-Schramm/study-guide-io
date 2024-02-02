"use client";

import { ProfessorContext } from "@/contexts/ProfessorContext";
import React, { useContext } from "react";
import { PersonalView } from "./PersonalView";

// TODO: Replce with window.locatio.hash or URLSearchParams(window.location.href)
// TODO: Fix so Create doesnt display until settings setup
// TODO: Use OPFS as fallback if user says no to showing directory
export const HomeContent = ({
  handleClick,
}: {
  handleClick: (newLocation: string) => void;
}) => {
  const { professor } = useContext(ProfessorContext);
  const { stem } = professor;

  return {
    personal: <PersonalView />,
    basic: <BasicView handleClick={handleClick} />,
    newUser: <NewUserView />,
  }[checkPageType(stem)];
};

function NewUserView() {
  const { professor, reSyncCourses } = useContext(ProfessorContext);
  const { stem } = professor;

  if (stem !== undefined) {
    throw new Error("Unreachable state met in HomeContent.tsx: NewUserView()");
  }

  return (
    <>
      <div>Placeholder image...</div>
      <h2>We need some things from you to get started...</h2>

      <button
        type="button"
        onClick={() => {
          reSyncCourses(true);
        }}
      >
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
  const { professor } = useContext(ProfessorContext);
  const { stem } = professor;

  if (stem?.length !== 0) {
    throw new Error("Unreachable state met in HomeContent.tsx: BasicView()");
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

function checkPageType(fileHandles: FileSystemFileHandle | undefined) {
  let index: "personal" | "basic" | "newUser";

  if (typeof fileHandles === "undefined") index = "newUser";
  else if (fileHandles.length) index = "personal";
  else index = "basic";

  return index;
}
