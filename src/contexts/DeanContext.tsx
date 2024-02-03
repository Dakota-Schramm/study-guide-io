import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { STEMProfessor } from "@/app/teaching-board";

type IDean = {
  permissions?: "read" | "readwrite" | null;
  root?: FileSystemDirectoryHandle;
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
    const stemProfessor = await new STEMProfessor();
    await stemProfessor.initialize();
    if (!stemProfessor.handle || !stemProfessor.courses) {
      return;
    }

    setDean((prev) => ({
      ...prev,
      root: stemProfessor.getRoot(),
      stem: stemProfessor,
    }));
  }, []);

  return (
    <DeanContext.Provider value={{ dean, setDean, reSyncCourses }}>
      {children}
    </DeanContext.Provider>
  );
};
