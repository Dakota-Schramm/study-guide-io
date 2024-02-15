import React from "react";

const PermissionsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col w-full h-full justify-center items-between space-y-8 container">
      {children}
    </main>
  );
};

export default PermissionsLayout;
