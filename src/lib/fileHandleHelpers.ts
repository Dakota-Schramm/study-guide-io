import { sitePath } from "@/lib/utils";

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
