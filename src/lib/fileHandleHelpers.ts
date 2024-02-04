import { sitePath } from "@/lib/utils";

// TODO: Add localStorage check for initialization

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
    if (error.name === "AbortError") {
      return null;
    }

    console.log(`${typeof error}: ${error.message}`);
    return null;
  }
}

/**
 * requires use of window
 * MUST BE a user action to work
 */
export async function setupHomeDirectory() {
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
