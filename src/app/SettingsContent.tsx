"use client";

import React, { useContext, useEffect, useState } from "react";

import { SettingsContext } from "@/contexts/SettingsContext";
import { handleFileSetup } from "@/user_lifecycle_methods";

export const SettingsContent = () => {
  const { settings, setSettings } = useContext(SettingsContext);
  const { guideHandles } = settings;

  function handleTour() {
    handleFileSetup((handles) => {
      setSettings({
        ...settings,
        guideHandles: handles,
      });
    });
  }

  useEffect(() => console.log({ guideHandles }), [guideHandles]);

  return (
    <>
      <button type="button" onClick={handleTour}>
        Setup directory
      </button>
    </>
  );
};
