"use client";

import React, { useContext } from "react";

import { Button } from "@/components/ui/button";

import { UserContext } from "@/contexts/UserContext";

// TODO: Add button for full user to choose a new home directory
// TODO: Add button to delete all user data
export default function SettingsContent() {
  const { reSyncCourses } = useContext(UserContext);

  return (
    <>
      <Button className="flex flex-col" onClick={() => reSyncCourses()}>
        <span className="font-bold">Setup directory</span>
        <ul className="opacity-50">
          <li>Reinitialize your courses as if you're logging in</li>
        </ul>
      </Button>
    </>
  );
}
