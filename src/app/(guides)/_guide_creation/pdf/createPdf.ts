"use client";

import { PDFDocument } from "pdf-lib";

export async function createFileObjectUrl(pdfs: File[], images: File[]) {
  const pdfBlob = await createPdf(pdfs, images);

  //! Make sure to revoke the URL when finished!
  const fileObjectUrl = URL.createObjectURL(pdfBlob);
  return fileObjectUrl;
}

export async function createPdf(pdfs: File[], images: File[]) {
  const pdfDoc = await PDFDocument.create();
  copyPages(pdfDoc, pdfs);
  if (images) {
    embedImages(pdfDoc, images);
  }
  const pdfBytes = await pdfDoc.save();

  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  return pdfBlob;
}

// Examples
async function copyPages(pdfDocument: PDFDocument, pdfs: File[]) {
  // const fileType = pdfs[0].type;
  // if (fileType !== "pdf") throw new Error("Incorrect file type found");

  const filesPdfBytes = await Promise.all(
    Array.from(pdfs).map(async (file) => {
      const bytes = await file.arrayBuffer();
      const pageCount = getPageCount(file);

      return {
        bytes,
        pageCount,
      };
    }),
  );

  const loadedPdfs = await Promise.all(
    filesPdfBytes.map(async (bundle) => {
      const { pageCount, bytes } = bundle;

      return {
        document: await PDFDocument.load(bytes),
        pageCount,
      };
    }),
  );

  // TODO: Get this working for one page first, then for multiple pages
  for await (const loadedPdf of loadedPdfs) {
    const { pageCount, document } = loadedPdf;
    // const fullDocumentIndicies = Array.from(new Array(pageCount), (_, idx) => idx);

    // const pagesToAdd = await pdfDocument.copyPages(document, fullDocumentIndicies);
    const pagesToAdd = await pdfDocument.copyPages(document, [1]);

    for (const page of pagesToAdd) {
      pdfDocument.addPage(page);
    }
  }
}

async function embedImages(pdfDocument: PDFDocument, images: File[]) {
  // const pngs = images.filter((bundle) => bundle.type === "image-png");
  const pngs = images;
  const pngImageBundles = await Promise.all(
    Array.from(pngs).map(async (file) => {
      const bytes = await file.arrayBuffer();
      const pngImage = await pdfDocument.embedPng(bytes);
      const pngDims = pngImage.scale(0.5);

      return {
        image: pngImage,
        dims: pngDims,
      };
    }),
  );

  for (const pngImageBundle of pngImageBundles) {
    const { image, dims } = pngImageBundle;
    const page = pdfDocument.addPage();

    page.drawImage(image, {
      x: page.getWidth() / 2 - dims.width / 2,
      y: page.getHeight() / 2 - dims.height / 2 + 250,
      width: dims.width,
      height: dims.height,
    });
  }
}

// Copied Code
function readFile(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);

    reader.readAsArrayBuffer(file);
  });
}

export async function getPageCount(file: Blob) {
  const arrayBuffer = (await readFile(file)) as Uint8Array;

  const pdf = await PDFDocument.load(arrayBuffer);

  return pdf.getPageCount();
}
