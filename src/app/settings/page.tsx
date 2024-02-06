"use client";

import React, { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";

export default function SettingsContent() {
  const { reSyncCourses } = useContext(UserContext);

  return (
    <>
      <button type="button" onClick={() => reSyncCourses()}>
        Setup directory
      </button>
    </>
  );
}
