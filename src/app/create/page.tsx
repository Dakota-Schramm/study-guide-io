"use client";

import React from "react";
import Link from "next/link";

export default function CreateContent() {
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
