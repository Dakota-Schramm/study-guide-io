import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { BaseCourse, STEMCourse, instantiateCourses } from "@/app/course";
import { setUpApp } from "@/app/setUpApp";

type IDean = {
  root?: FileSystemDirectoryHandle;
  stem?: CourseCollection;
};

type CourseCollection = {
  handle: FileSystemDirectoryHandle;
  courses: BaseCourse[];
};

export const DeanContext = createContext({
  dean: {
    root: undefined,
    stem: undefined,
  },
  setDean: (professor: IDean) => {},
  reSyncCourses: (userAction: boolean) => {},
});

/**
 * The provider that handles globals for the app
 */
export const DeanProvider = ({ children }: { children: ReactNode }) => {
  const [dean, setDean] = useState<IDean>({
    root: undefined,
    stem: undefined,
  });

  const reSyncCourses = useCallback(async (userAction: boolean) => {
    const handles = await setUpApp();

    if (!handles?.stem) return;

    const stemCourses = await instantiateCourses([handles.stem]);
    setDean({
      root: handles.root,
      stem: {
        handle: handles.stem,
        courses: stemCourses,
      },
    });
  }, []);

  return (
    <DeanContext.Provider value={{ dean, setDean, reSyncCourses }}>
      {children}
    </DeanContext.Provider>
  );
};
