'use client';

import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ProfessorContext } from '@/contexts/ProfessorContext';
import { STEMCourse } from './course';


type CourseCard = {
  title: string;
  files: number;
};

const CourseCard = ({
  title,
  files,

}: CourseCard) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>STEM Course</CardDescription>
    </CardHeader>
    <CardContent>
      <p>{files} files available</p>
    </CardContent>
    <CardFooter className='space-x-4'>
      <button type="button" className='p-2 text-white border border-solid border-gray-500 bg-blue-500'>Open</button>
      <button type="button" className='p-2 text-white border border-solid border-gray-500 bg-yellow-500'>Edit</button>
      <button type="button" className='p-2 text-white border border-solid border-gray-500 bg-red-500'>Delete</button>
    </CardFooter>
  </Card>
)

// TODO: Allow user to select a course to view in app
export const PersonalView = () => {
  const { professor, } = useContext(ProfessorContext);
  const { stem } = professor;

  if (!stem?.length) {
    throw new Error('Unreachable state met in HomeContent.tsx: PersonalView()');
  }

  return stem.map((course: STEMCourse) => <div>
    <CourseCard
      title={course.getName()}
      files={course.getFiles()?.length ?? 0}
    />
  </div>);
}
