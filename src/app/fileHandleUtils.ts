import { sitePath } from "@/lib/utils";

// TODO: Add localStorage check for initialization

/**
 * requires use of window
 */
async function requestDirectoryPermission() {
  try {
    const fsdHandle = await window.showDirectoryPicker({
      mode: "readwrite",
      startIn: "documents",
    });

    // TODO: Save the handle to the file system directory in IndexedDB

    console.log({ fsdHandle });
    return fsdHandle;
  } catch (error: unknown) {
    const exception = error as DOMException;
    if (exception.name === "AbortError") return null;

    console.log(`${typeof exception}: ${exception.message}`);
  }
}

/**
 * requires use of window
 * MUST BE a user action to work
 */
export async function setupHomeDirectory() {
  const fsdHandle = await requestDirectoryPermission();
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
  ) {
    return;
  }

  return courseTypeDirectories;
}

/**
 * checks to see if subDirectory exists within the given fileHandle
 */
export async function findSubDirectory(
  handle: FileSystemDirectoryHandle,
  name: string,
): Promise<FileSystemDirectoryHandle | null> {
  let found = null;
  for await (const subdirectory of handle.entries()) {
    const [fileName, fileObj] = subdirectory;
    if (fileName === name) {
      found = fileObj;
      break;
    }
  }

  return found;
}

//? Maybe use this eventually
// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle#return_handles_for_all_files_in_a_directory
