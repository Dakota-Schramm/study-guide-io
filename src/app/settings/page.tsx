"use client";

import React, { useContext, useEffect } from "react";

import { DeanContext } from '@/contexts/UserContext';

export default function SettingsContent() {
  const { dean, reSyncCourses } = useContext(DeanContext);
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
