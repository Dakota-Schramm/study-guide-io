"use client";

import React from "react";
import { Disclosure } from "@headlessui/react";

export const ExamEditListItem = ({ exam, idx }) => {
  return (
    <Disclosure>
      <div className="flex">
        <p>Exam {idx}</p>
        <Disclosure.Button>View</Disclosure.Button>
        <button type="button">Delete</button>
      </div>
      <Disclosure.Panel className="text-gray-500">
        Yes! You can purchase a license that you can share with your entire
        team.
      </Disclosure.Panel>
    </Disclosure>
  );
};
