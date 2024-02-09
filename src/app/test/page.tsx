'use client'

import React from 'react'
import { PDFDocument, PDFEmbeddedPage, PDFFont, PDFPage, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

async function handleDownload(
  fileName: string = "test.pdf",
) {
  const cornellArrayBytes = await setupCornellNotes();
  const blob = new Blob([cornellArrayBytes], { type: "application/pdf" });
  const fileObjectUrl = URL.createObjectURL(blob);

  const downloadEle = document.createElement("a");
  downloadEle.href = fileObjectUrl;
  downloadEle.download = fileName;
  downloadEle.click();
}

async function setupCornellNotes() {
  const pdfDoc = await PDFDocument.create()

  const fontBytes = await (await fetch("./mullish.ttf"))
    .arrayBuffer();

  pdfDoc.registerFontkit(fontkit)
  const customFont = await pdfDoc.embedFont(fontBytes)

  const sciencePdfBytes = await fetch("science.pdf").then((res) =>
    res.arrayBuffer(),
  );
  const sciencePdf = await PDFDocument.load(sciencePdfBytes);

  for (const page of sciencePdf.getPages()) {
    // Add a blank page to the document
    const docPage = pdfDoc.addPage()
    console.log({ width: page.getWidth(), height: page.getHeight() })

    const embedPage = await pdfDoc.embedPage(page);

    setupCornellPage(docPage, embedPage, customFont, [
      { question: "What is the main idea of this text? Write out using the terms defined in the first class.", yPos: 750 },
      { question: "What are the key details of this passage? How does it impact later events in the book?", yPos: 700 },
      { question: "What are the key vocabulary words?", yPos: 650 },
      { question: "What is the author's purpose? How does this help to define the direction of his storeis? How does it specifically affect this one?", yPos: 600 },
    ], "This is a summary")
  }

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()
  return pdfBytes;

}

async function setupCornellPage(
  page: PDFPage,
  embeddedContent: PDFEmbeddedPage,
  font: PDFFont,
  questions: { question: string; yPos: number }[],
  summary: string
) {
  const { width, height } = page.getSize()
  const questionColumnWidth = .3 * width;
  const noteSectionWidth = .7 * width;
  const contentHeight = .81 * height;
  const summarySectionHeight = .19 * height;
  const margin = 8;

  // const textWidth = customFont.widthOfTextAtSize(text, textSize)
  // const textHeight = customFont.heightAtSize(textSize)

  const fontSize = 8
  const color = rgb(0, 0, 0);

  // SETUP BORDERS
  page.drawRectangle({
    x: questionColumnWidth,
    y: summarySectionHeight,
    width: noteSectionWidth,
    height: contentHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1.5,
  })

  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: summarySectionHeight,
    borderColor: color,
    borderWidth: 1.5,
  })

  page.drawPage(embeddedContent, {
    width: noteSectionWidth,
    height: contentHeight,
    x: questionColumnWidth,
    y: 0,
  })

  // SETUP QUESTIONS + SUMMARY
  questions.forEach(({ question, yPos }) => {
    page.drawText(question, {
      x: margin,
      y: yPos,
      size: fontSize,
      lineHeight: 8,
      font: font,
      color: color,
      maxWidth: questionColumnWidth - margin,
    })
  })

  page.drawText(summary, {
    x: margin,
    y: summarySectionHeight - margin,
    size: fontSize,
    lineHeight: 8,
    font: font,
    color: color,
    maxWidth: questionColumnWidth - (2 * margin),
  })
}


const page = () => {
  return (
    <div>
      <h1>page</h1>
      <button onClick={() => handleDownload()}>Click</button>
    </div>
  )
}


export default page