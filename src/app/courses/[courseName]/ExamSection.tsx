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

export const ExamSection = ({ courseName, exams }) => {
  if (!exams) {
    return <p>Loading...</p>;
  }

  return (
    <Table className="bg-blue-500 dark:bg-blue-900">
      <TableCaption>A list of all exams for {courseName}.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">Exam Number</TableHead>
          <TableHead>Files Included</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam, idx) => (
          <TableRow key={idx}>
            <TableCell className="text-right">{idx + 1}</TableCell>
            <TableCell>
              <ul className="flex space-x-4">
                {exam.map((file) => (
                  <li>{file}</li>
                ))}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
