"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const FileTableRow = ({ file, idx }) => {
  const { name } = file;
  const [fileName, extension] = name.split(".");

  return (
    <TableRow key={idx}>
      <TableCell>{fileName}</TableCell>
      <TableCell>{extension}</TableCell>
    </TableRow>
  );
};

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
          <FileTableRow {...{ file, idx }} />
        ))}
      </TableBody>
    </Table>
  );
};
