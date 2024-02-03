"use client";

import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { DeanContext } from "@/contexts/DeanContext";
import { STEMCourse } from "./course";

type CourseCard = {
  title: string;
  files: FileSystemFileHandle[];
};

const CourseCard = ({ title, files }: CourseCard) => {
  const fileCount = files.length;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>STEM Course</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{fileCount} files available</p>
      </CardContent>
      <CardFooter className="space-x-4">
        <Popover>
          <PopoverTrigger className="p-2 text-white border border-solid border-gray-500 bg-blue-500">
            Open
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex gap-4">
              {files.map((file) => (
                <div>
                  <div className="border border-solid border-black w-20 h-20" />
                  <h3>{file.name}</h3>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <button
          type="button"
          className="p-2 text-white border border-solid border-gray-500 bg-yellow-500"
        >
          Edit
        </button>
        <button
          type="button"
          className="p-2 text-white border border-solid border-gray-500 bg-red-500"
        >
          Delete
        </button>
      </CardFooter>
    </Card>
  );
};

// TODO: Allow user to select a course to view in app
export const PersonalView = () => {
  const { dean } = useContext(DeanContext);
  const { stem } = dean;

  return (
    <div className="grid grid-cols-3 gap-8">
      {stem.courses.map((course: STEMCourse) => (
        <CourseCard
          key={course.id}
          title={course.getName()}
          files={course.getFiles()}
        />
      ))}
      ;
    </div>
  );
};
