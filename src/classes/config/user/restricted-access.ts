import { openDB } from "idb";

import { createPdf } from "@/app/(guides)/_guide_creation/pdf/createPdf";
import { BaseUserConfig, DownloadGuideOptions } from "./base";
import { getDatabaseInfo } from "@/lib/idbUtils";
import { ensureError } from "@/lib/utils";

export class RestrictedAccessUserConfig extends BaseUserConfig {
  async initialize() {
    const root = await navigator.storage.getDirectory();
    await super.initialize(root);
  }

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
}
