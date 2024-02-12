"use client";

import React, { useContext, useEffect, useState } from "react";
import { Document, Page } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { setupCornellNotes } from "../../../setupCornellNotes";
import PDFViewer, {
  LoadedPDF,
  PDFProps,
} from "@/app/(guides)/_guide_creation/pdf/PdfViewer";
import { UserContext } from "@/contexts/UserContext";
import InteractablePage from "./InteractablePage";

import type { Question } from "../../../setupCornellNotes";

const PDF = ({
  handleDocumentLoadSuccess,
  handleAddQuestion,
  filePath,
  pageTotal = 0,
  pdfQuestions,
}: PDFProps & {
  handleAddQuestion: () => void;
  pdfQuestions: Question[][];
}) => {
  if (!filePath) return;

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
        <InteractablePage
          key={index}
          index={index}
          pdfQuestions={pdfQuestions?.[index] ?? []}
          handleAddQuestion={handleAddQuestion}
        />
      ))}
    </Document>
  );
};

// TODO: Set up handler that takes page number, question and yPos
// TODO: For each page, set up a handler that uses prev handler to add questions to pages
// TODO: Combine state into single state object?
// - Create hook for all of this?

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
  const [pdfQuestions, setPdfQuestions] = useState<Question[][] | undefined>(
    undefined,
  );

  useEffect(() => {
    if (pdfStatus.status !== "loaded") return;
    setPdfQuestions(new Array(pdfStatus.pageTotal).fill([]));
  }, [pdfStatus]);

  function handleDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setPdfStatus({
      status: "loaded",
      currentPage: 1,
      pageTotal: numPages,
    });
  }

  function handleAddQuestion(question: Question, page: number) {
    if (!pdfQuestions) return;

    const newQuestions = [];

    for (let pgNum = 0; pgNum < pdfQuestions.length; pgNum++) {
      const questionPage = pdfQuestions[pgNum];

      if (pgNum !== page) newQuestions.push(questionPage);
      else newQuestions.push([...questionPage, question]);
    }

    console.log({ newQuestions });
    setPdfQuestions(newQuestions);
  }

  // TODO: DRY up with other handleDownload functions
  async function handleDownload(questions?: Question[][]) {
    if (!pdf) return;

    const cornellArrayBytes = await setupCornellNotes(pdf, questions);
    const blob = new Blob([cornellArrayBytes], { type: "application/pdf" });
    const [name, extension] = fileName.split(".");
    const newFileName = `${name}-study-guide.${extension}`;
    user?.config?.downloadBlobToFileSystem(blob, {
      courseName,
      fileName: newFileName,
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
      <ScrollArea className="row-span-8">
        <PDF
          filePath={pdf}
          pageTotal={pdfStatus?.pageTotal}
          {...{ handleDocumentLoadSuccess, handleAddQuestion, pdfQuestions }}
        />
      </ScrollArea>
      <Button onClick={() => handleDownload(pdfQuestions, pdf)}>
        Download Study Guide
      </Button>
    </div>
  );
};

export default CornellNotesCreatePage;
