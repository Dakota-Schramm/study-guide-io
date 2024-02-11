"use client";

import { DarkModeToggle } from "@/components/DarkModeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FaHouseChimney } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaFileCirclePlus } from "react-icons/fa6";

export const HomeHeader = () => {
  const pathName = usePathname();

  if (pathName.endsWith("/")) {
    return;
  }

  return (
    <header className="flex justify-between w-screen p-4">
      <nav className="flex p-4 space-x-8 divide-x">
        <Link href="/">
          <span className="flex items-center">
            <FaHouseChimney />
            Home
          </span>
        </Link>
        <Link href="/create">
          <span className="flex items-center">
            <FaFileCirclePlus />
            Create
          </span>
        </Link>
        <Link href="/settings">
          <span className="flex items-center">
            <FaGear />
            Settings
          </span>
        </Link>
      </nav>
      <section>
        <DarkModeToggle />
      </section>
    </header>
  );
};
