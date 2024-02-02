import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { BaseCourse, STEMCourse, instantiateCourses } from "@/app/course";
import { setUpApp } from "@/app/setUpApp";

type IProfessor = {
  root?: FileSystemDirectoryHandle;
  stem?: CourseCollection;
};

type CourseCollection = {
  handle: FileSystemDirectoryHandle;
  courses: BaseCourse[];
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

  const reSyncCourses = useCallback(async (userAction: boolean) => {
    const handles = await setUpApp();

    if (!handles?.stem) return;

    const stemCourses = await instantiateCourses([handles.stem]);
    setProfessor({
      root: handles.root,
      stem: {
        handle: handles.stem,
        courses: stemCourses,
      },
    });
  }, []);

  return (
    <ProfessorContext.Provider
      value={{ professor, setProfessor, reSyncCourses }}
    >
      {children}
    </ProfessorContext.Provider>
  );
};
