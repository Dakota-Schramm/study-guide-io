import { ReactNode, createContext, useCallback, useState } from "react";

import { STEMProfessor } from "@/app/professor";
import { University } from "@/app/university";

export type IDean = {
  permissions: Nullable<"read" | "readwrite">;
  root: Nullable<FileSystemDirectoryHandle>;
  stem?: STEMProfessor;
};

type DeanContext = {
  dean: IDean;
  setDean: (professor: IDean) => void;
  reSyncCourses: () => void;
};

export const DeanContext = createContext<DeanContext>({
  dean: {
    permissions: undefined,
    root: undefined,
    stem: undefined,
  },
  setDean: (professor: IDean) => {},
  reSyncCourses: () => {},
});

/**
 * The provider that handles globals for the app
 */
export const DeanProvider = ({ children }: { children: ReactNode }) => {
  const [dean, setDean] = useState<IDean>({
    permissions: undefined,
    root: undefined,
    stem: undefined,
  });

  const reSyncCourses = useCallback(async () => {
    const university = new University();
    await university.initialize();

    const root = university.getRoot() as FileSystemDirectoryHandle | null;
    const appPermissions = root !== null ? "readwrite" : null;

    const newDeanState: IDean = {
      permissions: appPermissions,
      root,
      stem: university.getTeachingBoard()?.stem,
    };

    setDean(newDeanState);
  }, []);

  return (
    <DeanContext.Provider value={{ dean, setDean, reSyncCourses }}>
      {children}
    </DeanContext.Provider>
  );
};
