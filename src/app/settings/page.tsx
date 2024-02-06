"use client";

import React, { useContext, useEffect } from "react";

import { UserContext } from "@/contexts/UserContext";

export default function SettingsContent() {
  const { user, reSyncCourses } = useContext(UserContext);
  const { stem } = dean;

  useEffect(() => console.log({ stem }), [stem]);

  return (
    <>
      <button type="button" onClick={() => reSyncCourses()}>
        Setup directory
      </button>
    </>
  );
}
