import { IDBPDatabase } from "idb";
import { openDB } from 'idb';

export const VERSION_NUMBER = 1;

export const idb = {
  stemCourses: openDB('stemCourses', VERSION_NUMBER)
}

// TODO: Add support for course handles as well?
export async function syncHandles(
  appHandle: FileSystemDirectoryHandle,
  stemHandle: FileSystemDirectoryHandle,
) {
  const db = await idb.handles;
  await saveAppHandlesToDB(db, appHandle, stemHandle);
  console.log("synced")
}

async function saveAppHandlesToDB(
  db: IDBPDatabase,
  appHandle: FileSystemDirectoryHandle,
  stemHandle: FileSystemDirectoryHandle,
) {
  const STORE_NAME = 'root';
  
  const tx = db
    .transaction(STORE_NAME, 'readwrite');

  await Promise.all([
    tx.store.put('app', JSON.stringify(appHandle)),
    tx.store.put('stem', JSON.stringify(stemHandle)),
    tx.done,
  ]);

  // stemCourses.forEach((course) => {
  //   db.add('stem-courses', course.getName(), course.getHandle())
  // })
}

export async function loadCourses() {
  const db = await idb.handles;

  let handles = null;

  try {
    handles = await db.getAll('stem')
  } catch (error: unknown) {
    if ((error instanceof Error)) {
      if (error.name !== "NotFoundError") throw error
    };
  } 

  console.log(handles);
  return handles
}