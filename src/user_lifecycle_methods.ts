"use client";

import { sitePath } from "@/lib/utils";

async function requestDirectoryPermission(userAction = true) {
  if (!userAction) {
    // TODO: Show an alert to prompt the user to allow access to their file system
    return;
  }

  try {
    const fsdHandle = (await window.showDirectoryPicker({
      mode: "readwrite",
      startIn: "documents",
    }));

    // TODO: Save the handle to the file system directory in IndexedDB

    return fsdHandle;
  } catch (error: unknown) {
    const exception = error as DOMException;
    switch (exception.name) {
      case "AbortError":
        return null;
      default:
        console.log(`${typeof exception}: ${exception.message}`);
    }
  }
}

export async function locateHomeDirectory(userAction: boolean) {
  const fsdHandle = await requestDirectoryPermission(userAction);
  if (!fsdHandle) {
    // TODO: Fix message
    alert("You must allow access to your file system to use this app.");
    return;
  }

  let homeDir = fsdHandle;
  const isRootDirectoryAppDirectory = fsdHandle.name === sitePath;
  if (!isRootDirectoryAppDirectory) {
    const homeDir = await fsdHandle
      .getDirectoryHandle(sitePath, { create: true, });
  }

  return homeDir

}

//? Maybe use this eventually
// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle#return_handles_for_all_files_in_a_directory
