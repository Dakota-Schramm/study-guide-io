import { openDB } from "idb";

import { createPdf } from "@/app/(guides)/_guide_creation/pdf/createPdf";
import { BaseUserConfig, DownloadGuideOptions } from "./base";
import { getDatabaseInfo } from "@/lib/idbUtils";

export class RestrictedAccessUserConfig extends BaseUserConfig {
  async initialize() {}
  async downloadGuideToFileSystem(
    pdfFiles: FileList,
    attachmentFiles: FileList,
    options: DownloadGuideOptions,
  ): Promise<void> {
    const db = await this.setupDatabaseWithStore("courses", options.courseName);

    // TODO: Make sure type get set and put in db here

    const pdfBlob = await createPdf(pdfFiles, attachmentFiles);
    // const arrayBytes = await pdfBlob.arrayBuffer();

    console.log(options.courseName, pdfBlob, options.fileName);
    await db.put(options.courseName, pdfBlob, options.fileName);
  }

  private async setupDatabaseWithStore(
    dbName: string,
    objectStoreName: string,
  ) {
    const { version, objectStoreNames } = await getDatabaseInfo(dbName);
    let db;

    // This is dumb but you have to have the version number to upgrade the db to the next version
    // since createObjectStore must be done in an upgrade transaction
    const objectStoreExists = objectStoreNames.contains(objectStoreName);
    if (objectStoreExists) {
      db = await openDB(dbName, version);
    } else {
      db = await openDB(dbName, version + 1, {
        upgrade(db) {
          db.createObjectStore(objectStoreName);
        },
      });
    }

    return db;
  }
}
