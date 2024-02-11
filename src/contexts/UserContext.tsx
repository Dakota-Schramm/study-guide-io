"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { RestrictedAccessUserConfig } from "@/classes/config/user/restricted-access";
import { BaseUserConfig } from "@/classes/config/user/base";
import { CourseFactory } from "@/classes/course/factory";
import { Course } from "@/classes/course/course";
import { useRouter } from "next/navigation";

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
  courses?: Course[];
};

function useUser() {
  const [user, setUser] = useState<IUser>({
    config: undefined,
    courses: undefined,
  });
  const { courses } = user;
  const router = useRouter();

  useEffect(function setUpConfig() {
    async function initConfig() {
      const config = determineUserConfig();
      setUser((prev) => ({ ...prev, config }));
    }
    initConfig();
  }, []);

  const reSyncCourses = useCallback(
    async (userConfig = determineUserConfig()) => {
      await userConfig.initialize();

      const courseFactory = new CourseFactory(userConfig);
      await courseFactory.initialize();
      const courses = courseFactory.courses;

      showDebugInfo(courses);

      const newUserState: IUser = {
        config: userConfig,
        courses,
      };
      setUser(newUserState);
      router.push("/courses");
    },
    [],
  );

  // TODO: Add requirement that courseNames are unique
  const addExamToCourse = useCallback(
    async (courseName: string, exams: string[]) => {
      const course = courses?.find((c) => c.getName() === courseName);
      if (!course) {
        throw new Error(
          `Course could not be found with courseName: ${courseName}`,
        );
      }

      window.log.info(
        `Creating exam for ${course.getName()} with files: ${exams.join(", ")}`,
      );
      await course.assignFilesToExam(exams);
    },
    [JSON.stringify(courses)],
  );

  return {
    user,
    setUser,
    reSyncCourses,
    addExamToCourse,
  };
}

type UserContext = {
  user: IUser;
  setUser: (user: IUser) => void;
  reSyncCourses: (userConfig?: BaseUserConfig | null) => void;
  addExamToCourse: (courseName: string, exams: string[]) => void;
};

export const UserContext = createContext<UserContext>({
  user: {
    config: undefined,
    courses: undefined,
  },
  setUser: (user: IUser) => {},
  reSyncCourses: () => {},
  addExamToCourse: () => {},
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
