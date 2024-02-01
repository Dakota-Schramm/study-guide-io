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
    })) as FileSystemDirectoryHandle;

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

export async function handleFileSetup(
  collectFileHandles: (files: FileSystemHandle[]) => void,
  userAction = true,
) {
  const fsdHandle = await requestDirectoryPermission(userAction);
  if (!fsdHandle) {
    // TODO: Fix message
    alert("You must allow access to your file system to use this app.");
    return;
  }

  let files = [];
  console.log(fsdHandle.name, sitePath, fsdHandle.name === sitePath)
  const isRootDirectoryAppDirectory = fsdHandle.name === sitePath;
  if (!isRootDirectoryAppDirectory) {
    const studyGuideIo = await fsdHandle.getDirectoryHandle(sitePath, {
      create: true,
    });

    for await (const entry of studyGuideIo.entries()) {
      files.push(entry);
    }
  } else {
    for await (const entry of fsdHandle.entries()) {
      files.push(entry);
    }
  }

  collectFileHandles(files);
  window.localStorage.setItem("isSetup", "true");
}

// async function* getFilesRecursively(entry) {
//   if (entry.kind === "file") {
//     const file = await entry.getFile();
//     if (file !== null) {
//       file.relativePath = getRelativePath(entry);
//       yield file;
//     }
//   } else if (entry.kind === "directory") {
//     for await (const handle of entry.values()) {
//       yield* getFilesRecursively(handle);
//     }
//   }
// }