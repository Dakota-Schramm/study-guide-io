import React, { useContext, useState } from "react";
import { Combobox } from "@headlessui/react";

import { UserContext } from "@/contexts/UserContext";

// TODO: Add keyboard controls to options to allow selecting easily
// TODO: Add animations to open/close
// TODO: Make both inputs same size
// TODO: Fix spacing between label and input
const CourseNameComboBox = () => {
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState("");

  const courses = user?.courses ?? [];
  const filteredCourses =
    query === ""
      ? courses
      : courses.filter((course) => {
          return course?.getName()?.includes(query.toLowerCase());
        });

  const courseOptions = filteredCourses.length ? (
    <Combobox.Options className="absolute w-full border border-solid border-blue-500 p-4 bg-gray-500 text-white dark:bg-white dark:text-gray-800">
      {filteredCourses.map((course) => (
        <Combobox.Option
          key={course.id}
          value={course.getName()}
          onClick={() => setQuery(course.getName() ?? "")}
        >
          {course.getName()}
        </Combobox.Option>
      ))}
    </Combobox.Options>
  ) : undefined;

  return (
    <Combobox as="div" className="relative" value={filteredCourses}>
      <label>
        Course Name
        <Combobox.Input
          className="border border-solid border-red-500 w-full h-full"
          as="input"
          type="text"
          name="course-name"
          placeholder="Mathematics"
          onChange={(event) => setQuery(event.target.value)}
          value={query}
          autocomplete="off"
        />
      </label>
      {courseOptions}
    </Combobox>
  );
};

export default CourseNameComboBox;
