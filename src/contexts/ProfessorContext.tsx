import { STEMCourse, instantiateCourses } from "@/app/course";
import { locateHomeDirectory } from "@/user_lifecycle_methods";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

type IProfessor = {
  root?: FileSystemDirectoryHandle;
  stem?: (typeof STEMCourse)[];
};

export const ProfessorContext = createContext({
  professor: {
    root: undefined,
    stem: undefined,
  },
  setProfessor: (professor: IProfessor) => {},
  reSyncCourses: (userAction: boolean) => {},
});

/**
 * The provider that handles globals for the app
 */
export const ProfessorProvider = ({ children }: { children: ReactNode }) => {
  const [professor, setProfessor] = useState<IProfessor>({
    root: undefined,
    stem: undefined,
  });

  const reSyncCourses = useCallback(
    async (userAction: boolean) => {
      const homeDirHandle = await locateHomeDirectory(userAction);
      if (!homeDirHandle) return;

      // Replace with Array.fromAsync().filter()
      const files = [];
      for await (const entry of homeDirHandle.entries()) {
        if (entry[0] === "STEM") files.push(entry[1]);
      }

      const stem = await instantiateCourses(files);
      setProfessor({ ...professor, stem });
    },
    [],
  );

  return (
    <ProfessorContext.Provider
      value={{ professor, setProfessor, reSyncCourses }}
    >
      {children}
    </ProfessorContext.Provider>
  );
};
