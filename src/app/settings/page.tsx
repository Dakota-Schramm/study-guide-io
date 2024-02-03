"use client";

import React, { useContext, useEffect } from "react";

import { DeanContext } from "@/contexts/DeanContext";

export default function SettingsContent() {
  const { dean, reSyncCourses } = useContext(DeanContext);
  const { stem } = dean;

  useEffect(() => console.log({ stem }), [stem]);

  // TODO: Create button that allows user to reinitialize a study guide folder?
  return (
    <>
      <button type="button" onClick={() => reSyncCourses()}>
        Setup directory
      </button>
    </>
  );
}
