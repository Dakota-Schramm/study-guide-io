"use client";

import { useContext } from "react";

import GuideCreationProcess from "../_guide_creation/GuideCreationProcess";
import { UserContext } from "@/contexts/UserContext";

const STEM = () => {
  const { user } = useContext(UserContext);

  if (user?.config === undefined) {
    if (window) window.location.href = "/";
  }

  return (
    <>
      <h1>STEM</h1>
      <GuideCreationProcess />
    </>
  );
};

export default STEM;
