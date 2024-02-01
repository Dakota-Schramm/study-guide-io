"use client";

import React, { forwardRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SettingsContent } from "./SettingsContent";
import { HomeContent } from "./HomeContent";

const CreateContent = () => (
  <>
    <Link href="/stem" className="border h-24 lg:h-32 p-4">
      STEM
    </Link>
    <Link href="/writing" className="border h-24 lg:h-32 p-4">
      Writing
    </Link>
  </>
);

const OptionSwitcher = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const index = searchParams.get("section") || "home";

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  function handleClick(section: string) {
    router.push(`${pathname}?${createQueryString("section", section)}`);
  }

  return {
    home: <HomeContent {...{ handleClick }} />,
    create: <CreateContent />,
    settings: <SettingsContent />,
  }[index];
};

//? Maybe use https://ui.shadcn.com/docs/components/hover-card for documents
export default function Home() {
  return (
    <main className="flex w-full h-full justify-center items-between space-x-8">
      <OptionSwitcher />
    </main>
  );
}
