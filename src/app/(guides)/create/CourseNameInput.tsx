import React, { useContext, useState } from "react";
import { Combobox } from "@headlessui/react";

import { UserContext } from "@/contexts/UserContext";

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

  return (
    <Combobox value={filteredCourses}>
      <Combobox.Input
        name="course-name"
        placeholder="Mathematics"
        onChange={(event) => setQuery(event.target.value)}
        value={query}
      />
      <Combobox.Options>
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
    </Combobox>
  );
};

export default CourseNameComboBox;
