"use client";

import React, { useContext, useEffect, useState } from "react";

import { ProfessorContext } from "@/contexts/ProfessorContext";

export const SettingsContent = () => {
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
};
