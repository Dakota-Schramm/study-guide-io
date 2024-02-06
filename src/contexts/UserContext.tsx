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

    const config = determineUserAppAccess() === "FullAccessUser"
      ? new FullAccessUserConfig()
      ? new RestrictedAccessUserConfig();

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


function determineUserAppAccess() {
  const isMozillaBrowser = /mozilla/i.test(navigator.userAgent);
  const isSafariBrowser = checkIfSafari();

  function checkIfSafari() {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("safari") && !ua.includes("chrome");
  }

  const isIncompatibleBrowser = isMozillaBrowser || isSafariBrowser;
  const isAppBroken = isIncompatibleBrowser && window.showDirectoryPicker === undefined;

  return isAppBroken
    ? "RestrictedAccessUser"
    : "FullAccessUser";
}