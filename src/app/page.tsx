"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import SettingsContent from "./settings/page";
import { HomeContent } from "./HomeContent";
import CreateContent from "./create/page";

const Home = () => {
  let index = "home";
  const path = window.location.href;
  if (path === "/settings") index = "settings";
  else if (path === "/create") index = "create";

  const content = {
    home: <HomeContent />,
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
