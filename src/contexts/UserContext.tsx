"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
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
  const router = useRouter();

  const setupPermissions = useCallback(async () => {
    await user?.config?.initialize();

    if (!user?.config?.permitted) {
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

  return {
    user,
    setUser,
    setupPermissions,
    reSyncCourses,
  };
}

type UserContext = {
  user: IUser;
  setUser: (user: IUser) => void;
  setupPermissions: () => void;
  reSyncCourses: (userConfig?: BaseUserConfig | null) => void;
};

export const UserContext = createContext<UserContext>({
  user: {
    config: undefined,
    courses: undefined,
  },
  setupPermissions: () => {},
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
