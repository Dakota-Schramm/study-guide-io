"use client";

import React, { useContext } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { UserContext } from "@/contexts/UserContext";
import { sitePath } from "@/lib/utils";

const Home = () => {
  const { user, reSyncCourses } = useContext(UserContext);
  if (user.config === null)
    throw new Error("RestrictedAccessUserConfig::PermissionRejected");

  return (
    <main className="flex w-full h-full justify-center items-between space-x-8">
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
    </main>
  );
};

export default Home;
