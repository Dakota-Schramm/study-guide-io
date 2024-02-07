import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { BaseCourse, STEMCourse } from "@/classes/course";

export type IUser = {
  config?: BaseConfig;
  courses?: BaseCourse[];
};

const ResyncConfig = {
  STEM: STEMCourse,
};

function useUser() {
  const [user, setUser] = useState<IUser>({
    config: undefined,
    courses: undefined,
  });

  // TODO: Just change checks looking at this to use instanceof
  const permissions = user?.config?.getRoot() !== null ? "readwrite" : null;

  useEffect(function setUpConfig() {
    async function initConfig() {
      const config =
        determineUserAppAccess() === "FullAccessUser"
          ? new FullAccessUserConfig()
          : new RestrictedAccessUserConfig();
      await config.initialize();
      setUser((prev) => ({ ...prev, config }));
    }
    initConfig();
  }, []);

  const reSyncCourses = useCallback(async () => {
    const userConfig = new FullAccessUserConfig();
    await userConfig.initialize();

    const courseTypeHandles = userConfig.getCourseTypeHandles();
    const courses: BaseCourse[] = [];
    if (courseTypeHandles) {
      for (const [key, handle] of courseTypeHandles) {
        const courseConstructor = ResyncConfig[key];

        const loadedCourses = await collectAndInitializeCoursesForCourseType(
          userConfig.getRoot(),
          handle,
          courseConstructor,
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

  return {
    user,
    setUser,
    reSyncCourses,
  };
}

type UserContext = {
  user: IUser;
  setUser: (user: IUser) => void;
  reSyncCourses: () => void;
  findCourseHandle: () => void;
};

export const UserContext = createContext<UserContext>({
  user: {
    config: undefined,
    courses: undefined,
  },
  setUser: (user: IUser) => {},
  reSyncCourses: () => {},
  findCourseHandle: () => {},
});

/**
 * The provider that handles globals for the app
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userState = useUser();

  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
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
  root: FileSystemDirectoryHandle,
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
    await course.initialize(root, "STEM");

    return course;
  });

  const courses = await Promise.all(coursePromises);
  console.log({ courses });
  return courses.filter((course) => course !== undefined);
}

function determineUserAppAccess() {
  const isMozillaBrowser = /mozilla/i.test(navigator.userAgent);
  const isSafariBrowser = checkIfSafari();

  function checkIfSafari() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("safari") && !ua.includes("chrome");
  }

  const isIncompatibleBrowser = isMozillaBrowser || isSafariBrowser;
  const isAppBroken =
    isIncompatibleBrowser && window.showDirectoryPicker === undefined;

  return isAppBroken ? "RestrictedAccessUser" : "FullAccessUser";
}
