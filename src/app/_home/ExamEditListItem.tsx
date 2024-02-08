"use client";

import React from "react";
import { Disclosure } from "@headlessui/react";

type ExamEditListItemProps = {
  exam: string[];
  idx: number;
  handleDelete: (idx: number) => Promise<void>;
};

export const ExamEditListItem = ({
  exam,
  idx,
  handleDelete,
}: ExamEditListItemProps) => {
  return (
    <Disclosure>
      <div className="flex">
        <p>Exam {idx}</p>
        <Disclosure.Button>View</Disclosure.Button>
        <button type="button" onClick={() => handleDelete(idx)}>
          Delete
        </button>
      </div>
      <Disclosure.Panel>
        <ol>
          {exam.map((fileName, i) => (
            <li key={i}>{fileName}</li>
          ))}
        </ol>
      </Disclosure.Panel>
    </Disclosure>
  );
};
