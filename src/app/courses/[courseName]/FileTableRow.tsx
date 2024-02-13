"use client";

import React from "react";
import Link from "next/link";

import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FaNotesMedical } from "react-icons/fa6";
import { OpenStudyGuideButton } from "./OpenStudyGuideButton";

const CreateStudyGuideButton = ({
  courseName,
  file,
  hasStudyGuide,
}: {
  courseName: string;
  file: FileSystemFileHandle;
  hasStudyGuide: boolean;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/cornell-notes/${courseName}/${file.name}/create`}
            onClick={(event) => {
              if (hasStudyGuide) {
                event.preventDefault();
              }
            }}
            className={
              hasStudyGuide ? "cursor-not-allowed text-gray-500" : undefined
            }
          >
            <FaNotesMedical />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Create a study guide for {file.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

type FileTableRowProps = {
  fileName: string;
  courseName: string;
  file: FileSystemFileHandle;
  hasStudyGuide: boolean;
  idx: number;
};

export const FileTableRow = ({
  fileName,
  courseName,
  file,
  hasStudyGuide,
  idx,
}: FileTableRowProps) => {
  console.log({ courseName, file, hasStudyGuide, idx });
  const [handleName, extension] = file.name.split(".");

  return (
    <TableRow key={idx}>
      <TableCell>{fileName}</TableCell>
      <TableCell>{extension}</TableCell>
      {extension === "pdf" ? (
        <TableCell>
          <CreateStudyGuideButton {...{ courseName, file, hasStudyGuide }} />
        </TableCell>
      ) : undefined}
      {hasStudyGuide ? (
        <TableCell>
          <OpenStudyGuideButton fileName={handleName} {...{ file }} />
        </TableCell>
      ) : undefined}
    </TableRow>
  );
};
