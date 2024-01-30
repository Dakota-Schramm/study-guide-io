"use client";

import { PDFDocument } from "pdf-lib";

export async function createFileObjectUrl(pdfs: FileList, images: FileList) {
  const pdfBlob = await createPdf(pdfs, images);

  //! Make sure to revoke the URL when finished!
  const fileObjectUrl = URL.createObjectURL(pdfBlob);
  return fileObjectUrl;
}

export async function createPdf(pdfs: FileList, images: FileList) {
  const pdfDoc = await PDFDocument.create();
  await copyPages(pdfDoc, pdfs);
  if (images) {
    await embedImages(pdfDoc, images);
  }
  const pdfBytes = await pdfDoc.save();

  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
  return pdfBlob;
}

async function copyPages(pdfDocument: PDFDocument, pdfs: FileList) {
  // const fileType = pdfs[0].type;
  // if (fileType !== "pdf") throw new Error("Incorrect file type found");

  const filesPdfBytes = await Promise.all(
    Array.from(pdfs).map(async (file) => await file.arrayBuffer()),
  );

  const loadedPdfs = await Promise.all(
    filesPdfBytes.map(async (bytes) => await PDFDocument.load(bytes)),
  );

  for await (const loadedPdf of loadedPdfs) {
    const pageCount = loadedPdf.getPageCount();
    const fullDocumentIndicies = Array.from(
      new Array(pageCount),
      (_, idx) => idx,
    );

    const pagesToAdd = await pdfDocument.copyPages(
      loadedPdf,
      fullDocumentIndicies,
    );

    for (const page of pagesToAdd) {
      pdfDocument.addPage(page);
    }
  }
}

async function embedImages(pdfDocument: PDFDocument, images: FileList) {
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
