import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { STEMProfessor } from "@/app/teaching-board";
import { loadHandles, syncHandles } from "@/app/idbUtils";

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
    let appHandle;
    let stemHandle;

    const storedHandles = await loadHandles();
    if (storedHandles) {
      console.log(storedHandles)
    }

    const stemProfessor = new STEMProfessor();
    await stemProfessor.initialize();
    if (!stemProfessor.handle || !stemProfessor.courses) {
      return;
    }

    appHandle = stemProfessor.getRoot();
    stemHandle = stemProfessor.handle;

    setDean({
      root: appHandle,
      stem: stemProfessor,
    });
    await syncHandles(appHandle, stemHandle)
  }, []);

  return (
    <DeanContext.Provider value={{ dean, setDean, reSyncCourses }}>
      {children}
    </DeanContext.Provider>
  );
};
