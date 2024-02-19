"use client";

import React, { useCallback, useContext } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { GoAlertFill } from "react-icons/go";

import { sitePath } from "@/lib/utils";
import { UserContext } from "@/contexts/UserContext";
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

const PermissionsLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(UserContext);

  console.log({ user });

  if (user?.config?.permitted === false)
    throw new Error("RestrictedAccessUserConfig::PermissionRejected");

  const InitialAlert = useCallback(() => {
    if (user.config instanceof FullAccessUserConfig) {
      return <FullUserAlert />;
    }
    return;
  }, [user.config]);

  return (
    <>
      <InitialAlert />
      <main className="flex flex-col h-full items-between space-y-8 mx-10 items-center justify-center">
        {children}
      </main>
    </>
  );
};

export default PermissionsLayout;
