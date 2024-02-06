import { ReactNode, createContext, useCallback, useState } from "react";

import { ensureError, sitePath } from "@/lib/utils";
import { STEMProfessor } from "@/classes/professor";

export type IDean = {
  permissions: Nullable<"read" | "readwrite">;
  root: Nullable<FileSystemDirectoryHandle>;
  stem?: STEMProfessor;
};

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
  const [dean, setDean] = useState<IDean>({
    permissions: undefined,
    root: undefined,
    stem: undefined,
  });

  const reSyncCourses = useCallback(async () => {
    const root = await setupHomeDirectory();

    const stemProfessor = new STEMProfessor(root);
    await stemProfessor.initialize();

    showDebugInfo(stemProfessor);

    const appPermissions = root !== null ? "readwrite" : null;

    const newDeanState: IDean = {
      permissions: appPermissions,
      root,
      stem: stemProfessor,
    };

    setDean(newDeanState);
  }, []);

  return (
    <DeanContext.Provider value={{ dean, setDean, reSyncCourses }}>
      {children}
    </DeanContext.Provider>
  );
};

// TODO: Add localStorage check for initialization
/**
 * requires use of window
 * MUST BE a user action to work
 */
async function setupHomeDirectory() {
  const fsdHandle = await requestDirectoryPermission();
  if (!fsdHandle) {
    return null;
  }

  let homeDir = fsdHandle;
  const isRootDirectoryAppDirectory = fsdHandle.name === sitePath;
  if (!isRootDirectoryAppDirectory) {
    homeDir = await fsdHandle.getDirectoryHandle(sitePath, {
      create: true,
    });
  }

  return homeDir;
}

/**
 * requires use of window
 * @returns a handle for the user selected directory or null
 */
async function requestDirectoryPermission() {
  try {
    const fsdHandle = await window.showDirectoryPicker({
      mode: "readwrite",
      startIn: "documents",
    });

    return fsdHandle;
  } catch (error: unknown) {
    const err = ensureError(error);
    if (err.name === "AbortError") {
      return null;
    }

    console.log(`${err.name}: ${err.message}`);
    return null;
  }
}

function showDebugInfo(stem) {
  const isDebugMode = window.log.getLevel() === window.log.levels.DEBUG;
  if (!isDebugMode) return;

  const courses = stem?.courses;
  if (!courses) return;

  for (const course of courses) {
    window.log.debug(course);
  }
}
