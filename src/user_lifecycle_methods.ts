"use client";

import { sitePath } from '@/lib/utils';

async function requestDirectoryPermission() {
  try {
    const fsdHandle = await window
      .showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'documents',
      }) as FileSystemDirectoryHandle;

    return fsdHandle
  } catch (error: unknown) {
    const exception = error as DOMException;
    switch (exception.name) {
      case 'AbortError': return null
      default:           console.log(`${typeof exception}: ${exception.message}`)
    }
  }
}

export async function handleFileSetup(collectFileHandles) {
  const fsdHandle = await requestDirectoryPermission();
  if (!fsdHandle) {
    // TODO: Fix message
    alert('You must allow access to your file system to use this app.')
    return;
  }

  console.log("Name => " + fsdHandle.name)

  let files;
  if (fsdHandle.name !== sitePath) {
    const studyGuideIo = await fsdHandle.getDirectoryHandle( sitePath, {
      create: true 
    });
    files = await Array.from(studyGuideIo.entries());
  } else {
    files = await Array.from(fsdHandle.entries());
  }

  collectFileHandles(files);
  window.localStorage.setItem('isSetup', 'true');
}