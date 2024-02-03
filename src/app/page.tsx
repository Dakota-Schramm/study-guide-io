"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import SettingsContent from "./settings/page";
import { HomeContent } from "./HomeContent";
import CreateContent from "./create/page";

const Home = () => {
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

  const content = {
    home: <HomeContent {...{ handleClick }} />,
    create: <CreateContent />,
    settings: <SettingsContent />,
  }[index];

  return (
    <main className="flex w-full h-full justify-center items-between space-x-8">
      {content}
    </main>
  );
};

export default Home;
