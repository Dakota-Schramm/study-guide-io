"use client";

import { DeanContext, IDean } from "@/contexts/DeanContext";
import React, { useContext, useEffect } from "react";
import { PersonalView } from "./PersonalView";
import { BaseCourse } from "./course";
import Link from "next/link";

// TODO: Replce with window.locatio.hash or URLSearchParams(window.location.href)
// TODO: Fix so Create doesnt display until settings setup
// TODO: Use OPFS as fallback if user says no to showing directory
export const HomeContent = ({
  handleClick,
}: {
  handleClick: (newLocation: string) => void;
}) => {
  const { dean } = useContext(DeanContext);
  const { permissions, stem } = dean;

  return {
    personal: <PersonalView />,
    basic: <BasicView handleClick={handleClick} />,
    newUser: <NewUserView {...{ permissions }} />,
  }[checkPageType(stem?.courses)];
};

type NewUserViewProps = {
  permissions: IDean["permissions"];
};
function NewUserView({ permissions }: NewUserViewProps) {
  if (permissions === undefined) return <UserBouncerView />;
  if (permissions === null) return <UserRefusedView />;
}

function UserBouncerView() {
  const { reSyncCourses } = useContext(DeanContext);
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

function UserRefusedView() {
  return (
    <>
      <h2>File System Permission has been Rejected:</h2>
      <ul>
        <li>App has limited features while in this mode</li>
        <li>
          This setting can be re-enabled at
          <Link href="/settings">
            <span>settings</span>
          </Link>
          .
        </li>
      </ul>
    </>
  );
}

function BasicView({
  handleClick,
}: {
  handleClick: (newLocation: string) => void;
}) {
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
