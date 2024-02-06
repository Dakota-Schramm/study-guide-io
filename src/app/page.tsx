"use client";

import React, { useCallback, useContext, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import SettingsContent from "./settings/page";
import { HomeContent } from "./_home/HomeContent";
import CreateContent from "./create/page";
import { isAppBroken } from "@/lib/browserHelpers";
import { UserContext } from "@/contexts/UserContext";

const Home = () => {
  const { setUser } = useContext(UserContext);

  let index = "home";
  const path = window.location.href;
  if (path === "/settings") index = "settings";
  else if (path === "/create") index = "create";

  const content = {
    home: <HomeContent />,
    create: <CreateContent />,
    settings: <SettingsContent />,
  }[index];

  useEffect(() => {
    if (isAppBroken) {
      setUser((prev) => ({
        permissions: null,
      }));
    }
  }, []);

  return (
    <main className="flex w-full h-full justify-center items-between space-x-8">
      {content}
    </main>
  );
};

export default Home;
