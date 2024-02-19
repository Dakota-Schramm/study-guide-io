"use client";

import { ReactNode, createContext, useCallback, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { RestrictedAccessUserConfig } from "@/classes/config/user/restricted-access";
import { BaseUserConfig } from "@/classes/config/user/base";
import { CourseFactory } from "@/classes/course/factory";
import { Course } from "@/classes/course/course";

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
  const router = useRouter();

  const setupPermissions = useCallback(async () => {
    await user?.config?.initialize();

    const isPermitted = user?.config?.permitted;
    if (!isPermitted) {
      toast("Permissions need to be accepted", {
        description: "You can accept permissions at /settings later.",
        action: {
          label: "Accept",
          onClick: async () => {
            await user?.config?.initialize();
            if (user?.config?.permitted) {
              router.push("/courses");
            }
          },
        },
      });
    }

    return;
  }, [user?.config]);

  const reSyncCourses = useCallback(async () => {
    if (!user?.config) {
      throw new Error("Config must be init'd");
    }
    const courseFactory = new CourseFactory(user?.config);
    await courseFactory.initialize();
    const courses = courseFactory.courses;

    showDebugInfo(courses);

    setUser((prev) => ({ ...prev, courses }));
  }, [user?.config]);

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
    setupPermissions,
    reSyncCourses,
    addExamToCourse,
  };
}

type UserContext = {
  user: IUser;
  setUser: (user: IUser) => void;
  setupPermissions: () => Promise<void>;
  reSyncCourses: (userConfig?: BaseUserConfig | null) => Promise<void>;
  addExamToCourse: (courseName: string, exams: string[]) => Promise<void>;
};

export const UserContext = createContext<UserContext>({
  user: {
    config: undefined,
    courses: undefined,
  },
  setUser: (user: IUser) => {},
  setupPermissions: async () => {},
  reSyncCourses: async () => {},
  addExamToCourse: async () => {},
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
