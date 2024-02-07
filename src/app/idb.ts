import { openDB } from "idb";

import { sitePath } from "@/lib/utils";

const VERSION_NUMBER = 1;
export const STORE_NAME = "handles";

export const idb = openDB(sitePath, VERSION_NUMBER, {
  upgrade(db) {
    db.createObjectStore(STORE_NAME);
  },
});
