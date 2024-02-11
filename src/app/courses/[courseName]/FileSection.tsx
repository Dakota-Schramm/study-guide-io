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
        {files.map((file, idx) => (
          <FileTableRow {...{ courseName, file, idx }} />
        ))}
      </TableBody>
    </Table>
  );
};
