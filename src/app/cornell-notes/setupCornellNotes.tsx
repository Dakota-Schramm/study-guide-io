"use client";

import { PDFEmbeddedPage, PDFPage, rgb } from "pdf-lib";
import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export type Question = {
  question: string;
  yPos: number;
};

export async function setupCornellNotes(
  originalPdf: File,
  questions?: Question[][],
) {
  console.log({ questions });
  const pdfDoc = await PDFDocument.create();

  await setupFonts(pdfDoc);
  const bytes = await originalPdf.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);

  for (let i = 0; i < pdf.getPageCount(); i++) {
    const docPage = pdfDoc.addPage();

    const page = pdf.getPage(i);
    const pageQuestions = questions?.[i].map((question) => ({
      question: question.question,
      yPos: page.getHeight() - question.yPos,
    }));

    const embedPage = await pdfDoc.embedPage(page);

    setupCornellPage(
      docPage,
      embedPage,
      pageQuestions ?? [],
      "This is a summary",
    );
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

async function setupCornellPage(
  page: PDFPage,
  embeddedContent: PDFEmbeddedPage,
  questions: { question: string; yPos: number }[],
  summary: string,
) {
  const { width, height } = page.getSize();
  const questionColumnWidth = 0.3 * width;
  const noteSectionWidth = 0.7 * width;
  const contentHeight = 0.81 * height;
  const summarySectionHeight = 0.19 * height;
  const margin = 8;

  // const textWidth = customFont.widthOfTextAtSize(text, textSize)
  // const textHeight = customFont.heightAtSize(textSize)
  const fontSize = 8;
  const color = rgb(0, 0, 0);

  // SETUP BORDERS
  page.drawRectangle({
    x: questionColumnWidth,
    y: summarySectionHeight,
    width: noteSectionWidth,
    height: contentHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1.5,
  });

  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: summarySectionHeight,
    borderColor: color,
    borderWidth: 1.5,
  });

  page.drawPage(embeddedContent, {
    width: noteSectionWidth,
    height: contentHeight,
    x: questionColumnWidth,
    y: summarySectionHeight,
  });

  // SETUP QUESTIONS + SUMMARY
  for (const { question, yPos } of questions) {
    page.drawText(question, {
      x: margin,
      y: (yPos * .81) + summarySectionHeight + margin,
      size: fontSize,
      lineHeight: 8,
      color: color,
      maxWidth: questionColumnWidth - margin,
    });
  }

  page.drawText(summary, {
    x: margin,
    y: summarySectionHeight - margin,
    size: fontSize,
    lineHeight: 8,
    color: color,
    maxWidth: questionColumnWidth - 2 * margin,
  });
}

async function setupFonts(pdfDoc: PDFDocument) {
  const response = await fetch("/mullish.ttf");
  const fontBytes = await response.arrayBuffer();
  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);
}
