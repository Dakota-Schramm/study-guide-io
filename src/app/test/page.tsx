'use client'

import React from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

async function  handleDownload() {
  // This should be a Uint8Array or ArrayBuffer
  // This data can be obtained in a number of different ways
  // If you're running in a Node environment, you could use fs.readFile()
  // In the browser, you could make a fetch() call and use res.arrayBuffer()
  const fontBytes = await (await fetch("./mullish.ttf"))
    .arrayBuffer();

  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create()

  // Register the `fontkit` instance
  pdfDoc.registerFontkit(fontkit)

  // Embed our custom font in the document
  const customFont = await pdfDoc.embedFont(fontBytes)

  // Add a blank page to the document
  const page = pdfDoc.addPage()

  // Create a string of text and measure its width and height in our custom font
  const text = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur assumenda a nihil nulla officia quidem sint consectetur quisquam praesentium, tempora, cumque tempore odio reprehenderit! Sint asperiores doloribus quisquam quia officia! Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur assumenda a nihil nulla officia quidem sint consectetur quisquam praesentium, tempora, cumque tempore odio reprehenderit! Sint asperiores doloribus quisquam quia officia!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur assumenda a nihil nulla officia quidem sint consectetur quisquam praesentium, tempora, cumque tempore odio reprehenderit! Sint asperiores doloribus quisquam quia officia!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur assumenda a nihil nulla officia quidem sint consectetur quisquam praesentium, tempora, cumque tempore odio reprehenderit! Sint asperiores doloribus quisquam quia officia!  "
  const textSize = 8 
  const textWidth = customFont.widthOfTextAtSize(text, textSize)
  const textHeight = customFont.heightAtSize(textSize)

  // Draw the string of text on the page
  page.drawText(text, {
    x: 40,
    y: 450,
    size: textSize,
    lineHeight: 8,
    font: customFont,
    color: rgb(0, 0, 0),
    maxWidth: 200,
  })

  // Draw a box around the string of text
  page.drawRectangle({
    x: 40,
    y: 450,
    width: textWidth,
    height: textHeight,
    borderColor: rgb(1, 0, 0),
    borderWidth: 1.5,
  })

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const fileObjectUrl = URL.createObjectURL(blob);

  const downloadEle = document.createElement("a");
  downloadEle.href = fileObjectUrl;
  downloadEle.download = "test.pdf";
  downloadEle.click();
}

const page = () => {
  return (
    <div>
      <h1>page</h1>
      <button onClick={handleDownload}>Click</button>
    </div>
  )
}


export default page