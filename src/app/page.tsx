"use client";

import React, { useEffect, useCallback, useContext } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import SettingsContent from "./settings/page";
import { HomeContent } from "./HomeContent";
import { DeanContext } from "@/contexts/DeanContext";
import CreateContent from "./create/page";

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
    const newQueryString = createQueryString("section", section);
    const newUrl = `${pathname}?${newQueryString}`;
    router.push(newUrl);
  }

  return {
    home: <HomeContent {...{ handleClick }} />,
    create: <CreateContent />,
    settings: <SettingsContent />,
  }[index];
};

//? Maybe use https://ui.shadcn.com/docs/components/hover-card for documents
export default function Home() {
  const { reSyncCourses } = useContext(DeanContext);

  // TODO: Add localStorage check for initialization
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only run on mount
  useEffect(() => {
    reSyncCourses(false);
  }, []);

  return (
    <>
      <main className="flex w-full h-full justify-center items-between space-x-8">
        <OptionSwitcher />
      </main>
    </>
  );
}
