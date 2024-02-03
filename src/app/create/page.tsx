"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { DeanContext } from "@/contexts/DeanContext";

export default function CreateContent() {
  const { dean } = useContext(DeanContext);

  // TODO: Fix this to redirect if dean state is not sufficient
  if (dean.permissions === undefined) {
    if (window) window.location.href = "/";
  }

  // TODO: Disable buttons before check is ran
  return (
    <>
      <Link href="/stem" className="border h-24 lg:h-32 p-4">
        STEM
      </Link>
      <Link href="/writing" className="border h-24 lg:h-32 p-4">
        Writing
      </Link>
    </>
  );
}
