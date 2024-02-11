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

const CreateStudyGuideButton = ({ file }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>
            <FaNotesMedical />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Create a study guide for {file.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const FileTableRow = ({ file, idx }) => {
  const { name } = file;
  const [fileName, extension] = name.split(".");

  return (
    <TableRow key={idx}>
      <TableCell>{fileName}</TableCell>
      <TableCell>{extension}</TableCell>
      <TableCell>
        <CreateStudyGuideButton file={file} />
      </TableCell>
    </TableRow>
  );
};
