"use client";

import React, { useContext, useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import { setupCornellPage } from "../../../setupCornellPage";
import PDFViewer, {
  LoadedPDF,
  PDFProps,
} from "@/app/(guides)/_guide_creation/pdf/PdfViewer";
import { UserContext } from "@/contexts/UserContext";
import { Document, Page } from "react-pdf";

const PDF = ({
  handleDocumentLoadSuccess,
  filePath,
  pageTotal = 0,
  width,
  height,
}: PDFProps) => {
  if (!filePath) return;

  console.log({ filePath, pageTotal });

  // TODO: Add better handling here for large pdfs
  // TODO: Add drag-and-drop support for reordering pages of pdf
  // TODO: Keep widths and heights consistent between styles and page props
  return (
    <Document
      className="flex flex-col space-y-8 justify-center items-center"
      file={filePath}
      onLoadSuccess={handleDocumentLoadSuccess}
    >
      {Array.from(new Array(pageTotal), (_, index) => (
        <Page
          className="border border-black border-solid"
          // onClick={(event) => console.log({ event })}
          //! key={`base_ordering_${index}`} Replace with crypto hash at creation?
          pageNumber={index + 1}
        />
      ))}
    </Document>
  );
};

// Use with suspense??
const CornellNotesCreatePage = ({
  params,
}: { params: { courseName: string; fileName: string } }) => {
  const { user } = useContext(UserContext);
  const { courses } = user;

  const { courseName } = params;
  const fileName = decodeURIComponent(params.fileName);

  const [pdf, setPdf] = useState<File | undefined>(undefined);
  const [pdfStatus, setPdfStatus] = useState<LoadedPDF>({
    status: "uninitialized",
  });

  function handleDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setPdfStatus({
      status: "loaded",
      currentPage: 1,
      pageTotal: numPages,
    });
  }

  useEffect(() => {
    async function setup() {
      const fileHandle = courses
        ?.find((course) => course.getName() === courseName)
        ?.files?.find((file) => file.name === fileName);

      const file = await fileHandle?.getFile();
      console.log({ courseName, fileName, fileHandle, file });
      setPdf(file);
    }
    setup();
  }, [courses]);

  if (user?.courses === undefined) {
    if (window) window.location.href = "/";
  }

  // if (!pdf) return <div>Loading...</div>

  return (
    <div className="grid grid-rows-10 w-full h-full container">
      <h1>
        Create Study Guide for file {fileName} from course {courseName}
      </h1>
      <div className="row-span-8">
        <PDF
          filePath={pdf}
          pageTotal={pdfStatus?.pageTotal}
          {...{ handleDocumentLoadSuccess }}
        />
      </div>
      <button onClick={() => handleDownload(pdf)}>Click</button>
    </div>
  );
};

// TODO: DRY up with other handleDownload functions
async function handleDownload(pdfFile?: File, fileName = "test.pdf") {
  if (!pdfFile) return;

  const cornellArrayBytes = await setupCornellNotes(pdfFile);
  const blob = new Blob([cornellArrayBytes], { type: "application/pdf" });
  const fileObjectUrl = URL.createObjectURL(blob);

  const downloadEle = document.createElement("a");
  downloadEle.href = fileObjectUrl;
  downloadEle.download = fileName;
  downloadEle.click();
}

async function setupCornellNotes(originalPdf: File) {
  const pdfDoc = await PDFDocument.create();

  const fontBytes = await (await fetch("./mullish.ttf")).arrayBuffer();
  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const bytes = await originalPdf.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);

  for (const page of pdf.getPages()) {
    const docPage = pdfDoc.addPage();
    console.log({ width: page.getWidth(), height: page.getHeight() });

    const embedPage = await pdfDoc.embedPage(page);

    setupCornellPage(
      docPage,
      embedPage,
      customFont,
      [
        {
          question:
            "What is the main idea of this text? Write out using the terms defined in the first class.",
          yPos: 750,
        },
        {
          question:
            "What are the key details of this passage? How does it impact later events in the book?",
          yPos: 700,
        },
        { question: "What are the key vocabulary words?", yPos: 650 },
        {
          question:
            "What is the author's purpose? How does this help to define the direction of his storeis? How does it specifically affect this one?",
          yPos: 600,
        },
      ],
      "This is a summary",
    );
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

export default CornellNotesCreatePage;
