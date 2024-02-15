"use client";

import React, { useContext } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GoAlertFill } from "react-icons/go";
import { FaLockOpen } from "react-icons/fa6";

import { UserContext } from "@/contexts/UserContext";
import { sitePath } from "@/lib/utils";
import { FullAccessUserConfig } from "@/classes/config/user/full-access";

const FullUserAlert = () => (
  <Alert className="bg-red-700 text-white relative">
    <GoAlertFill className="absolute left-0 fill-white text-[26px] " />
    <AlertTitle>Choosing Your Home Directory</AlertTitle>
    <AlertDescription>
      {`Please select either your ${sitePath} folder or the one it's in if setting up for the first time.`}
    </AlertDescription>
  </Alert>
);

const SetupCard = () => {
  const { user, reSyncCourses } = useContext(UserContext);

  return (
    <Card className="flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-xl text-muted-foreground">
          We need some things from you to get started...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>Placeholder image...</div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => reSyncCourses(user?.config)}>
          <FaLockOpen className="mr-4" />
          Setup permissions
        </Button>
      </CardFooter>
    </Card>
  );
};
const Permissions = () => {
  const { user } = useContext(UserContext);
  if (user.config === null)
    throw new Error("RestrictedAccessUserConfig::PermissionRejected");

  return (
    <>
      {user.config instanceof FullAccessUserConfig ? (
        <FullUserAlert />
      ) : undefined}
      <SetupCard />
    </>
  );
};

export default Permissions;
