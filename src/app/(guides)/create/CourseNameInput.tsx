import React from "react";

import TextInput from "./TextInput";

const CourseNameInput = () => {
  return (
    <TextInput
      labelText="Course Name"
      name="course-name"
      placeholder="Mathematics"
    />
  );
};

export default CourseNameInput;
