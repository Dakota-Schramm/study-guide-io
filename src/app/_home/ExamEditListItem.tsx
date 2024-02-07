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
      <Disclosure.Panel>
        <ol>
          {exam.map((fileName, idx) => (
            <li key={idx}>{fileName}</li>
          ))}
        </ol>
      </Disclosure.Panel>
    </Disclosure>
  );
};
