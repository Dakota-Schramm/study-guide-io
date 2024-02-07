import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { BaseCourse, STEMCourse } from "@/classes/course";
import { RestrictedAccessUserConfig } from "@/classes/config/user/restricted-access";

/**
 * @param config a User's associated app configuration
 *  - FullAccessUserConfig => user has accepted on full access browser
 *  - RestrictedAccessUserConfig => using a restricted access browser
 *  - null => user has rejected access on full access browser
 *  - undefined => user is uninitialized
 *
 */
export type IUser = {
  config?: FullAccessUserConfig | RestrictedAccessUserConfig | null;
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

  useEffect(function setUpConfig() {
    async function initConfig() {
      const config = determineUserConfig();
      await config.initialize();
      setUser((prev) => ({ ...prev, config }));
    }
    initConfig();
  }, []);

  const reSyncCourses = useCallback(async () => {
    const userConfig = determineUserConfig();
    await userConfig.initialize();

    if (userConfig instanceof RestrictedAccessUserConfig) return;

    const root = userConfig.getRoot();
    if (!root) return;

    const courseTypeHandles = userConfig.getCourseTypeHandles();

    const courses: BaseCourse[] = [];
    if (courseTypeHandles) {
      for (const [key, handle] of courseTypeHandles) {
        const courseConstructor = ResyncConfig[key];

        const loadedCourses = await collectAndInitializeCoursesForCourseType(
          root,
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
};

export const UserContext = createContext<UserContext>({
  user: {
    config: undefined,
    courses: undefined,
  },
  setUser: (user: IUser) => {},
  reSyncCourses: () => {},
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
      return;
    }
    const course = new courseConstructor(courseFileHandle);
    await course.initialize(root, "STEM");

    return course;
  });

  const courses = await Promise.all(coursePromises);
  return courses.filter((course) => course !== undefined);
}

function determineUserConfig() {
  const config =
    determineUserAppAccess() === "FullAccessUser"
      ? new FullAccessUserConfig()
      : new RestrictedAccessUserConfig();

  return config;
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
