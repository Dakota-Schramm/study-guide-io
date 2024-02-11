"use client";

import React, { useContext, useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

import { setupCornellPage } from "../../../setupCornellPage";
import PDFViewer from "@/app/(guides)/_guide_creation/pdf/PdfViewer";
import { UserContext } from "@/contexts/UserContext";

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

// Use with suspense??
const CornellNotesCreatePage = ({
  params,
}: { params: { courseName: string; fileName: string } }) => {
  const { user } = useContext(UserContext);

  const { courseName } = params;
  const fileName = decodeURIComponent(params.fileName);

  const [pdf, setPdf] = useState<File | undefined>(undefined);

  useEffect(() => {
    async function setup() {
      console.log({ courseName, fileName });
      const fileHandle = user?.courses
        ?.find((course) => course.getName() === courseName)
        ?.files?.find((file) => file.name === fileName);

      const file = await fileHandle?.getFile();
      setPdf(file);
    }
    setup();
  }, []);

  if (user?.courses === undefined) {
    if (window) window.location.href = "/";
  }

  return (
    <div>
      <h1>page</h1>
      {pdf && (
        <PDFViewer
          dialogSize={{ width: 800, height: 800 }}
          pageSize={{ width: 800, height: 800 }}
          filePath={pdf}
        />
      )}
      <button onClick={() => handleDownload(pdf)}>Click</button>
    </div>
  );
};

export default CornellNotesCreatePage;
