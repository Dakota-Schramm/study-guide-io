"use client";

import { SettingsContext } from "@/contexts/SettingsContext";
import { handleFileSetup } from "@/user_lifecycle_methods";
import React, { useContext } from "react";

// TODO: Replce with window.locatio.hash or URLSearchParams(window.location.href)
// TODO: Fix so Create doesnt display until settings setup
// TODO: Use OPFS as fallback if user says no to showing directory
export const HomeContent = ({
  handleClick,
}: {
  handleClick: (newLocation: string) => void;
}) => {
  const { settings, setSettings } = useContext(SettingsContext);
  const { guideHandles } = settings;

  let index: "personal" | "basic" | "newUser";
  if (typeof guideHandles === "undefined") index = "newUser";
  else if (guideHandles.length) index = "personal";
  else index = "basic";

  return {
    personal: <PersonalView handleClick={handleClick} />,
    basic: <BasicView handleClick={handleClick} />,
    newUser: <NewUserView />,
  }[index];
};

function NewUserView() {
  const { settings, setSettings } = useContext(SettingsContext);
  const { guideHandles } = settings;

  if (guideHandles !== undefined) {
    throw new Error("Unreachable state met in HomeContent.tsx: NewUserView()");
  }

  function handleSetup() {
    handleFileSetup((handles) => {
      setSettings({
        ...settings,
        guideHandles: handles,
      });
    });
  }

  return (
    <>
      <div>Placeholder image...</div>
      <h2>We need some things from you to get started...</h2>

      <button type="button" onClick={handleSetup}>
        Setup permissions
      </button>
    </>
  );
}

function BasicView({
  handleClick,
}: {
  handleClick: (newLocation: string) => void;
}) {
  const { settings, setSettings } = useContext(SettingsContext);
  const { guideHandles } = settings;

  if (guideHandles?.length !== 0) {
    throw new Error("Unreachable state met in HomeContent.tsx: BasicView()");
  }

  return (
    <>
      <button type="button" onClick={() => handleClick("create")}>
        Create
      </button>
      <button type="button" onClick={() => handleClick("settings")}>
        Settings
      </button>
    </>
  );
}

function PersonalView() {
  const { settings, setSettings } = useContext(SettingsContext);
  const { guideHandles } = settings;

  if (!guideHandles?.length) {
    throw new Error("Unreachable state met in HomeContent.tsx: PersonalView()");
  }

  return guideHandles.map(() => <div>Personal view</div>);
}
