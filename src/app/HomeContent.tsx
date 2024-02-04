"use client";

import React, { useContext } from "react";
import Link from "next/link";

import { DeanContext, IDean } from "@/contexts/DeanContext";
import { PersonalView } from "./PersonalView";
import { BaseCourse } from "./course";
import { isAppBroken, isIncompatibleBrowser } from "@/lib/browserHelpers";

// TODO: Use OPFS as fallback if user says no to showing directory
export const HomeContent = () => {
  const { dean } = useContext(DeanContext);
  const { permissions, stem } = dean;

  return {
    personal: <PersonalView />,
    basic: <BasicView />,
    newUser: <NewUserView {...{ permissions }} />,
  }[checkPageType(stem?.courses)];
};

type NewUserViewProps = {
  permissions: IDean["permissions"];
};
function NewUserView({ permissions }: NewUserViewProps) {
  if (isAppBroken) return <UnsupportedBrowserView />;
  if (permissions === undefined) return <UserBouncerView />;
  if (permissions === null) return <UserRefusedView />;
}

function UnsupportedBrowserView() {
  return (
    <>
      <h2>
        Sorry, but all of this app's features don't currently work on this
        browser.
      </h2>
      <p>Consider switching to one of the following browsers instead:</p>
      <ul>
        <li>Google Chrome</li>
        <li>Microsoft Edge</li>
        <li>Opera</li>
      </ul>
    </>
  );
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

function BasicView() {
  return (
    <>
      <Link href="/create">Create</Link>
      <Link href="/settings">Settings</Link>
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
