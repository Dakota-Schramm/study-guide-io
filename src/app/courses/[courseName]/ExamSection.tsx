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
    <Table>
      <TableCaption>A list of all exams for {courseName}.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">Exam Number</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exams.map((exam, idx) => (
          <TableRow key={idx}>
            <TableCell className="text-right">{idx + 1}</TableCell>
            {exam.map((file) => (
              <TableCell>{file}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
