"use client";

import React, { useContext } from "react";

import { Button } from "@/components/ui/button";

import { UserContext } from "@/contexts/UserContext";
import { ButtonContent } from "./ButtonContent";
import DeleteAppDataButton from "./DeleteAppDataButton";

// TODO: Add button for full user to choose a new home directory
// TODO: Add button to delete all user data
export default function SettingsContent() {
  const { reSyncCourses } = useContext(UserContext);

  return (
    <>
      <Button onClick={() => reSyncCourses()} className="flex flex-col">
        <ButtonContent
          title="Setup directory"
          description="Reinitialize your courses as if you're logging in"
        />
      </Button>

      <DeleteAppDataButton />
    </>
  );
}
