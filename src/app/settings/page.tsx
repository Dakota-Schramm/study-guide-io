"use client";

import React, { useContext, useEffect } from "react";

import { ProfessorContext } from "@/contexts/ProfessorContext";

export default function SettingsContent() {
  const { professor, reSyncCourses } = useContext(ProfessorContext);
  const { stem } = professor;

  useEffect(() => console.log({ stem }), [stem]);

  return (
    <>
      <button type="button" onClick={() => reSyncCourses(true)}>
        Setup directory
      </button>
    </>
  );
}
