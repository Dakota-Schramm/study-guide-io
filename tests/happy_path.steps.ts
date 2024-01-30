import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { PDFDocument } from "pdf-lib";
import { Given, When, Then, Before } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

import { BaseWorld, IBaseWorld } from "./world";
import { Readable } from "stream";

const assert = require("assert");

/*
  SETUP
*/
interface ICreateGuideWorld extends IBaseWorld {
  download?: Buffer;
}

class CreateGuideWorld extends BaseWorld implements ICreateGuideWorld {}

setWorldConstructor(CreateGuideWorld);

Before(
  { tags: "@browser and @integration and @stem" },
  async function (this: ICreateGuideWorld) {
    console.log("running before tags:@browser and @stem");
    const browser = await chromium.launch({ headless: false });
    this.context = await browser.newContext();
    this.page = await this.context.newPage();

    await this.page.goto("localhost:3000/stem");
  },
);

/*
  TESTS
*/

const EXAMPLE_PDF_LENGTH = 3;

// TODO: Make this to where can replace "feature" with single statement?
When(
  "User creates a study guide with a pdf and no images",
  async function (this: ICreateGuideWorld) {
    const page = this.page!;
    await page.getByRole("button", { name: "Start" }).click();

    await page.getByLabel("Upload PDFs:").setInputFiles("science.pdf");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByRole("button", { name: "Next" }).click();

    await page.getByTestId("downloadGuide").click();
    page.on("download", async (download) => {
      const stream = await download.createReadStream();
      const buffer = await streamToUint8Array(stream);

      this.download = buffer;
    });
  },
);

Then(
  "User should have a pdf study guide with no additional pages\\/modifications",
  async function (this: ICreateGuideWorld) {
    console.log({ download: this.download });
    if (!this.download) return;

    const pdfDoc = await PDFDocument.load(this.download);
    const pages = await pdfDoc.getPageCount();
    assert.equal(pages, EXAMPLE_PDF_LENGTH);
  },
);

///////////

When(
  "User creates a study guide with a pdf and one image",
  async function (this: ICreateGuideWorld) {
    const page = this.page!;
    await page.getByRole("button", { name: "Start" }).click();

    await page.getByLabel("Upload PDFs:").setInputFiles("science.pdf");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByLabel("Upload images:").setInputFiles("dog.png");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByTestId("downloadGuide").click();
    page.on("download", async (download) => {
      const stream = await download.createReadStream();
      const buffer = await streamToUint8Array(stream);

      this.download = buffer;
    });
  },
);

Then(
  "User should have a pdf study guide with one additional page",
  async function (this: ICreateGuideWorld) {
    console.log({ download: this.download });
    if (!this.download) return;

    const pdfDoc = await PDFDocument.load(this.download);
    const pages = await pdfDoc.getPageCount();
    assert.equal(pages, EXAMPLE_PDF_LENGTH + 1);
  },
);

//////////

When(
  "User creates a study guide with a pdf and multiple images",
  async function (this: ICreateGuideWorld) {
    const page = this.page!;
    await page.getByRole("button", { name: "Start" }).click();

    await page.getByLabel("Upload PDFs:").setInputFiles("science.pdf");
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByLabel("Upload images:").setInputFiles([
      "dog.png",
      "cat.png",
      "rat.png",
      "dog.jpg",
    ]);
    await page.getByRole("button", { name: "Next" }).click();

    await page.getByTestId("downloadGuide").click();
    page.on("download", async (download) => {
      const stream = await download.createReadStream();
      const buffer = await streamToUint8Array(stream);

      this.download = buffer;
    });
  },
);

Then(
  "User should have a pdf study guide with four additional pages",
  async function (this: ICreateGuideWorld) {
    console.log({ download: this.download });
    if (!this.download) return;

    const pdfDoc = await PDFDocument.load(this.download);
    const pages = await pdfDoc.getPageCount();
    assert.equal(pages, EXAMPLE_PDF_LENGTH + 4);
  },
);

async function streamToUint8Array(stream: Readable) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array);
  }
  return Buffer.concat(chunks);
}
