"use client";

import Link from "next/link";

import { FaHouseChimney } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaFileCirclePlus } from "react-icons/fa6";

export const HomeHeader = () => {
  return (
    <header className="flex p-4 space-x-8 divide-x">
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
    </header>
  );
};