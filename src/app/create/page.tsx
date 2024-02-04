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
    <div className="grid grid-rows-7">
      <Link href="/stem" className="border h-24 lg:h-32 p-4">
        STEM
      </Link>
      <section className="row-span-4">
        <h4>Under Construction...</h4>
        <div>Placeholder image</div>
        <p>More coming soon!</p>
      </section>
    </div>
  );
}
