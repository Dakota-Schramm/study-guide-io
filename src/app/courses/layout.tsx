import React from "react";

const CoursesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid grid-cols-2 gap-16 lg:grid-cols-3 lg:gap-8 m-8">
      {children}
    </main>
  );
};

export default CoursesLayout;
