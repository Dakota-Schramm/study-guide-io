import React from "react";
const CreateLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col container space-y-16 justify-center h-full">
      {children}
    </main>
  );
};

export default CreateLayout;
