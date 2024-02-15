import React from "react";

const PermissionsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col h-full items-between space-y-8 mx-10 items-center justify-center">
      {children}
    </main>
  );
};

export default PermissionsLayout;
