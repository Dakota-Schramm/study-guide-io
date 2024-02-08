import { PDFComponents } from "@/app/(guides)/_guide_creation/Finalize";
import { createFileObjectUrl } from "@/app/(guides)/_guide_creation/pdf/createPdf";
import { BaseUserConfig, FullAccessDownloadGuideOptions } from "./base";

export class RestrictedAccessUserConfig extends BaseUserConfig {
  async initialize() {}
  async downloadGuideToFileSystem(
    pdfFiles: FileList,
    attachmentFiles: FileList,
  ): Promise<void> {
    return;
  }
}
