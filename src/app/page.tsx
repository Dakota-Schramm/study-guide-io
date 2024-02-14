"use client";

import React, { useContext, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import { GoAlertFill } from "react-icons/go";
import { FaLockOpen } from "react-icons/fa6";
import { AiOutlineLoading } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";

import { UserContext } from "@/contexts/UserContext";
import { sitePath } from "@/lib/utils";
import { Main } from "next/document";

const MainActionButton = ({ status, handleClick, }) => {
  let buttonContent;


  if (status === "idle") {
    buttonContent = (
      <>
        <FaLockOpen className="mr-4" />
        Setup permissions
      </>
    );
  } else if (status === "loading") {
    buttonContent = (
      <>
        <AiOutlineLoading className="mr-4 animate-spin" />
        Loading...
      </>
    )
  } else if (status === "loaded") {
    buttonContent = (
      <>
        <AiOutlineCheckCircle />
        Complete
      </>
    )
  }

  return <Button onClick={handleClick}>
    {buttonContent}
  </Button>

}

const Home = () => {
  const { user, reSyncCourses } = useContext(UserContext);
  const [status, setStatus] = useState<"idle" | "loading" | "loaded">("idle");

  if (user.config === null)
    throw new Error("RestrictedAccessUserConfig::PermissionRejected");

  async function handleClick() {
    setStatus("loading");
    await reSyncCourses(user?.config);
    setStatus("loaded");
  }

  return (
    <main className="flex w-full h-full justify-center items-between space-x-8">
      <div className="flex flex-col space-y-8">
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
        <MainActionButton {...{ status, handleClick }} />
      </div>
    </main>
  );
};

export default Home;
