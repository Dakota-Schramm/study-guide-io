"use client";

import React, { useContext } from "react";
import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { UserContext } from "@/contexts/UserContext";
import { BaseCourse } from "../../classes/course";
import { sitePath } from "@/lib/utils";
import { RestrictedAccessUserConfig } from "@/classes/config/user/restricted-access";
import { useRouter } from "next/navigation";

// TODO: Use OPFS as fallback if user says no to showing directory
export const HomeContent = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const pageType = checkPageType(user.courses);

  if (pageType === "personal") router.push("/courses");

  return {
    basic: <BasicView />,
    newUser: <NewUserView />,
    personal: undefined,
  }[pageType];
};

// TODO: Fix flashing of UserBouncerView that occurs on restricted users
function NewUserView() {
  const { user } = useContext(UserContext);

  if (user.config instanceof RestrictedAccessUserConfig)
    return <UnsupportedBrowserView />;
  if (user.config === null) return <UserRefusedView />;
  return <UserBouncerView />;
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
  const { user, reSyncCourses } = useContext(UserContext);

  return (
    <div className="flex flex-col space-y-8">
      <div>Placeholder image...</div>
      <h2>We need some things from you to get started...</h2>

      <Alert className="bg-red-700 text-white">
        <AlertTitle>Choosing Your Home Directory</AlertTitle>
        <AlertDescription>
          {`Please select either your ${sitePath} folder or the one it's in.`}
        </AlertDescription>
      </Alert>

      <button type="button" onClick={() => reSyncCourses(user?.config)}>
        Setup permissions
      </button>
    </div>
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
