"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileTableRow } from "./FileTableRow";

const FileTableRows = ({ courseName, files }) => {
  const courseInfo = {};
  for (const file of files) {
    const [fileName, extension] = file.name.split(".");
    console.log({ fileName });
    if (fileName.endsWith("-study-guide")) {
      const [name, _] = fileName.split("-study-guide");
      courseInfo[name] = [file, true];
    } else {
      if (!(fileName in courseInfo)) {
        courseInfo[fileName] = [file, false];
      }
    }
  }

  console.log({ courseInfo });

  return (
    <>
      {Object.entries(courseInfo).map(([fileName, valArr], idx) => {
        const [file, hasStudyGuide] = valArr;
        return (
          <FileTableRow
            {...{ fileName, file, hasStudyGuide, courseName, idx }}
          />
        );
      })}
    </>
  );
};

// TODO: Fix files display to group study-guide files together with their respective original files
export const FileSection = ({ courseName, files }) => {
  if (!files) {
    return <p>Loading...</p>;
  }

  return (
    <Table className="bg-red-500 dark:bg-red-900">
      <TableCaption>A list of all files for {courseName}.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">File Name</TableHead>
          <TableHead>Extension</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <FileTableRows {...{ courseName, files }} />
      </TableBody>
    </Table>
  );
};
