"use client";
import { PDFEmbeddedPage, PDFFont, PDFPage, rgb } from "pdf-lib";

export async function setupCornellPage(
  page: PDFPage,
  embeddedContent: PDFEmbeddedPage,
  font: PDFFont,
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
      y: yPos,
      size: fontSize,
      lineHeight: 8,
      font: font,
      color: color,
      maxWidth: questionColumnWidth - margin,
    });
  }

  page.drawText(summary, {
    x: margin,
    y: summarySectionHeight - margin,
    size: fontSize,
    lineHeight: 8,
    font: font,
    color: color,
    maxWidth: questionColumnWidth - 2 * margin,
  });
}
