import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { STEMProfessor } from "@/app/teaching-board";

type IDean = {
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
    root: undefined,
    stem: undefined,
  });

  const reSyncCourses = useCallback(async () => {
    const stemProfessor = await new STEMProfessor();
    await stemProfessor.initialize();
    if (!stemProfessor.handle || !stemProfessor.courses) {
      return;
    }

    setDean({
      root: stemProfessor.getRoot(),
      stem: stemProfessor,
    });
  }, []);

  return (
    <DeanContext.Provider value={{ dean, setDean, reSyncCourses }}>
      {children}
    </DeanContext.Provider>
  );
};
