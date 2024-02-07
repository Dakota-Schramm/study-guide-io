import { PDFComponents } from "@/app/(guides)/_guide_creation/Finalize";
// TODO: Implement base class for Full Access and Restricted users

export type FullAccessDownloadGuideOptions = {
  courseName: string;
  fileName: string;
};

export abstract class BaseUserConfig {
  abstract initialize(): void;

  //? Not sure what implementation requirements for this are. Can this have different signatures?
  abstract downloadGuide(
    pdfFiles: PDFComponents["pdfFiles"],
    attachmentFiles: PDFComponents["attachmentFiles"],
    fullAccessOptions: FullAccessDownloadGuideOptions,
  ): void;
}
