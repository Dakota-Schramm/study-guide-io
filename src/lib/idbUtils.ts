import { ensureError, sitePath } from "./utils";
import { STORE_NAME, idb } from "@/app/idb";

// TODO: Look into https://www.npmjs.com/package/idb-keyval instead?

// TODO: Add support for course handles as well?
export async function saveAppHandlesToDB(handles: {
  [key: string]: FileSystemDirectoryHandle;
}) {
  const { root } = handles;
  await (await idb).put(STORE_NAME, root, "root");

  window.log.info(`synced ${root.name} to idb`);
}

export async function getAppHandlesFromDB() {
  let handles = [];

  try {
    handles = await (await idb).getAll(STORE_NAME);
  } catch (error: unknown) {
    const err = ensureError(error);
    if (err.name === "NotFoundError") {
      return null;
    }
    window.log.error(`${err.name}: ${err.message}`);
    throw error;
  }

  return handles;
}
