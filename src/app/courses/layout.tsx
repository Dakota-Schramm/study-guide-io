import React from "react";

const CoursesLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className="grid grid-cols-3 gap-8">{children}</main>;
};

export default CoursesLayout;
