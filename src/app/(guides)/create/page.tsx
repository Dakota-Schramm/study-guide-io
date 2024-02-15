"use client";

import React, { useContext } from "react";

import { UserContext } from "@/contexts/UserContext";
import GuideCreationProcess from "../_guide_creation/GuideCreationProcess";

// TODO: Add other course types in future
// - Writing/Humanities?
export default function CreateContent() {
  const { user } = useContext(UserContext);

  // TODO: Move into middleware?
  if (user?.config === undefined) {
    if (window) window.location.href = "/permissions";
  }

  return (
    <>
      <h1>Create Guide</h1>
      <GuideCreationProcess />
    </>
  );
}
