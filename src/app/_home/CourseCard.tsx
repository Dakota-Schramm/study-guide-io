"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CourseCard = {
  title: string;
  files: number;
};

export const CourseCard = ({ title, files }: CourseCard) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>STEM Course</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{files} files available</p>
    </CardContent>
    <CardFooter className="space-x-4">
      <button
        type="button"
        className="p-2 text-white border border-solid border-gray-500 bg-blue-500"
      >
        Open
      </button>
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
