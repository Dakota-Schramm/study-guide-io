"use client";

import React, { useContext } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { GoAlertFill } from "react-icons/go";
import { FaLockOpen } from "react-icons/fa6";

import { UserContext } from "@/contexts/UserContext";
import { sitePath } from "@/lib/utils";

// TODO: Only show alert if user is fullaccess
const Permissions = () => {
  const { user, reSyncCourses } = useContext(UserContext);
  if (user.config === null)
    throw new Error("RestrictedAccessUserConfig::PermissionRejected");

  return (
    <>
      <div>Placeholder image...</div>
      <h2 className="text-xl text-muted-foreground">
        We need some things from you to get started...
      </h2>

      <Alert className="bg-red-700 text-white relative">
        <GoAlertFill className="absolute left-0 fill-white text-[26px] " />
        <AlertTitle>Choosing Your Home Directory</AlertTitle>
        <AlertDescription>
          {`Please select either your ${sitePath} folder or the one it's in.`}
        </AlertDescription>
      </Alert>

      <Button onClick={() => reSyncCourses(user?.config)}>
        <FaLockOpen className="mr-4" />
        Setup permissions
      </Button>
    </>
  );
};

export default Permissions;
