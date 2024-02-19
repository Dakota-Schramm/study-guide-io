"use client";

import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FaLockOpen } from "react-icons/fa6";

import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { RestrictedAccessUserConfig } from "@/classes/config/user/restricted-access";
import { UserContext } from "@/contexts/UserContext";

const PermissionsPage = () => {
  const { user, setUser, setupPermissions } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    const userConfig = determineUserConfig();
    setUser((prev) => ({ ...prev, config: userConfig }));
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

function determineUserConfig() {
  const config =
    determineUserAppAccess() === "FullAccessUser"
      ? new FullAccessUserConfig()
      : new RestrictedAccessUserConfig();

  return config;
}

function determineUserAppAccess() {
  const isMozillaBrowser = /mozilla/i.test(navigator.userAgent);
  const isSafariBrowser = checkIfSafari();

  function checkIfSafari() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("safari") && !ua.includes("chrome");
  }

  const isIncompatibleBrowser = isMozillaBrowser || isSafariBrowser;
  const isAppBroken =
    isIncompatibleBrowser && window.showDirectoryPicker === undefined;

  return isAppBroken ? "RestrictedAccessUser" : "FullAccessUser";
}

export default PermissionsPage;
