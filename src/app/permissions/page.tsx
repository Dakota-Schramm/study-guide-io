"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

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

import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { UserContext } from "@/contexts/UserContext";
import { sitePath } from "@/lib/utils";

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
  const { user, setupPermissions, setupConfig } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    setupConfig();
  }, []);

  async function handleClick() {
    await setupPermissions();

    if (user?.config?.permitted) {
      router.push("/courses");
    }
  }

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
        <Button onClick={handleClick}>
          <FaLockOpen className="mr-4" />
          Setup permissions
        </Button>
      </CardFooter>
    </Card>
  );
};
const Permissions = () => {
  const { user } = useContext(UserContext);
  if (user?.config?.permitted === false)
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
