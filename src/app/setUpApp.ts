import { sitePath } from "@/lib/utils";

export async function setUpApp() {
  const rootHandle = await locateHomeDirectory(false);
  if (!rootHandle) {
    // User needs to allow access
    return;
  }

  return {
    root: rootHandle,
    ...(await setupCourseTypeDirectories(rootHandle)),
  };
}

/**
 * requires use of window
 */
async function requestDirectoryPermission(userAction = true) {
  if (!userAction) {
    // TODO: Show an alert to prompt the user to allow access to their file system
    return;
  }

  try {
    const fsdHandle = await window.showDirectoryPicker({
      mode: "readwrite",
      startIn: "documents",
    });

    // TODO: Save the handle to the file system directory in IndexedDB

    return fsdHandle;
  } catch (error: unknown) {
    const exception = error as DOMException;
    if (exception.name === "AbortError") return null;

    console.log(`${typeof exception}: ${exception.message}`);
  }
}

/**
 * requires use of window
 */
export async function locateHomeDirectory(userAction: boolean) {
  const fsdHandle = await requestDirectoryPermission(userAction);
  if (!fsdHandle) {
    // TODO: Fix message
    // alert("You must allow access to your file system to use this app.");
    return;
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
 */
async function setupCourseTypeDirectories(root: FileSystemDirectoryHandle) {
  const courseTypeDirectories = {
    stem: undefined,
    writing: undefined,
  };

  courseTypeDirectories.stem = await root.getDirectoryHandle("STEM", {
    create: true,
  });

  if (
    courseTypeDirectories.stem === undefined &&
    courseTypeDirectories.writing === undefined
  )
    return;

  return courseTypeDirectories;
}

//? Maybe use this eventually
// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle#return_handles_for_all_files_in_a_directory
