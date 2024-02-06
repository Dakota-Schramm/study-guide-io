"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { UserContext } from "@/contexts/UserContext";

export default function CreateContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useContext(UserContext);
  const { permissions } = dean;

  if (dean.permissions === undefined) {
    if (window) window.location.href = "/";
  }

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
