import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { STEMProfessor } from "@/classes/professor";
import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { BaseCourse, STEMCourse } from "@/classes/course";

export type IDean = {
  permissions: Nullable<"read" | "readwrite">;
  root: Nullable<FileSystemDirectoryHandle>;
  stem?: STEMProfessor;
};

export type IUser = {
  config?: BaseConfig;
  courses?: BaseCourse[];
};

const ResyncConfig = {
  stem: { constructor: STEMCourse },
};

type findCourseHandleOptions = {
  create: boolean;
};

function useUser() {
  const [user, setUser] = useState<IUser>({
    config: undefined,
    courses: undefined,
  });

  // TODO: Just change checks looking at this to use instanceof
  const permissions = user?.config?.getRoot() !== null ? "readwrite" : null;

  useEffect(function setUpConfig() {
    // TODO: Copy from view that checks user type

    let config;
    if (userType === "FullAccessUser") {
      config = new FullAccessUserConfig();
    } else {
      config = new RestrictedAccessUserConfig();
    }

    setUser((prev) => ({ ...prev, config }));
  }, []);

  const reSyncCourses = useCallback(async () => {
    const userConfig = new FullAccessUserConfig();
    await userConfig.initialize();

    const courseTypeHandles = userConfig.getCourseTypeHandles();
    const courses: BaseCourse[] = [];
    if (courseTypeHandles) {
      for (const [key, handle] of courseTypeHandles) {
        const loadedCourses = await collectAndInitializeCoursesForCourseType(
          handle,
          ResyncConfig[key],
        );
        courses.push(...loadedCourses);
      }
    }
    showDebugInfo(courses);

    const newUserState: IUser = {
      config: userConfig,
      courses,
    };
    setUser(newUserState);
  }, []);

  // TODO: Wrap in useCallback
  // TODO: Move to FullAccessConfig
  /**
   * @param create whether the directory should be created if not found
   * @returns the FileSystemDirectoryHandle if create is true or if the directory exists, null otherwise
   */
  async function findCourseHandle(
    courseName: string,
    options: findCourseHandleOptions = { create: false },
  ): Promise<FileSystemDirectoryHandle | null> {
    let found = null;
    if (!this.handle) return found;

    const { create } = options;

    for await (const [fileName, fileObj] of this.handle.entries()) {
      if (fileName === courseName) {
        found = fileObj;
      }
    }

    if (!found && create) {
      found = this.handle.getDirectoryHandle(courseName, { create });
    }

    return found;
  }

  return {
    user,
    setUser,
    reSyncCourses,
    findCourseHandle,
  };
}

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
  const userState = useUser();

  return (
    <DeanContext.Provider value={userState}>{children}</DeanContext.Provider>
  );
};

function showDebugInfo(courses) {
  const isDebugMode = window.log.getLevel() === window.log.levels.DEBUG;
  if (!isDebugMode) return;

  if (!courses) return;

  for (const course of courses) {
    window.log.debug(course);
  }
}

async function collectAndInitializeCoursesForCourseType<C extends BaseCourse>(
  courseTypeHandle: FileSystemDirectoryHandle,
  courseConstructor: new (...args: FileSystemDirectoryHandle[]) => C,
) {
  const courseFiles = await Array.fromAsync(courseTypeHandle.entries());
  const coursePromises = courseFiles.map(async ([_, courseFileHandle]) => {
    if (courseFileHandle.kind !== "directory") {
      console.log({ courseFileHandle });
      return;
    }
    const course = new courseConstructor(courseFileHandle);
    await course.initialize(this.root);

    return course;
  });

  const courses = await Promise.all(coursePromises);
  console.log({ courses });
  return courses.filter((course) => course !== undefined);
}

/**
 *
 * @param type
 * @returns
 */
async function getCourseTypeHandle(
  type: Course,
  root: FileSystemDirectoryHandle,
) {
  let courseTypeHandle: FileSystemDirectoryHandle | undefined;

  try {
    courseTypeHandle = await root.getDirectoryHandle(type, {
      create: true,
    });
  } catch (error: unknown) {
    const err = ensureError(error);

    if (err.name === "NotAllowedError") {
      alert("You need to allow readwrite access to the root directory");
    }
    console.log(`${err.name}" ${err.message}`);
  }

  return courseTypeHandle;
}
