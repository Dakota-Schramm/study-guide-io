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
 *  - undefined => user is uninitialized
 *
 */
export type IUser = {
  config?: FullAccessUserConfig | RestrictedAccessUserConfig;
  courses?: Course[];
};

function useUser() {
  const [user, setUser] = useState<IUser>({
    config: undefined,
    courses: undefined,
  });
  const { courses } = user;

  const reSyncCourses = useCallback(async () => {
    if (!user?.config) {
      throw new Error("Config must be init'd");
    }
    const courseFactory = new CourseFactory(user?.config);
    await courseFactory.initialize();
    const courses = courseFactory.courses;

    showDebugInfo(courses);

    setUser(prev => ({ ...prev, courses }));
  }, []);

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

