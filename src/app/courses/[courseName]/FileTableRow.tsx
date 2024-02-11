"use client";

import React from "react";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FaNotesMedical } from "react-icons/fa6";
import Link from "next/link";

const CreateStudyGuideButton = ({
  courseName,
  file,
}: {
  courseName: string;
  file: FileSystemFileHandle;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={`/cornell-notes/${courseName}/${file.name}/create`}>
            <FaNotesMedical />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Create a study guide for {file.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

type FileTableRowProps = {
  courseName: string;
  file: FileSystemFileHandle;
  idx: number;
};

export const FileTableRow = ({ courseName, file, idx }: FileTableRowProps) => {
  const { name } = file;
  const [fileName, extension] = name.split(".");

  return (
    <TableRow key={idx}>
      <TableCell>{fileName}</TableCell>
      <TableCell>{extension}</TableCell>
      <TableCell>
        <CreateStudyGuideButton {...{ courseName, file }} />
      </TableCell>
    </TableRow>
  );
};
