import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { PDFDocument } from "pdf-lib";
import { Given, When, Then } from "@cucumber/cucumber";

import { BaseWorld, IBaseWorld } from "./world";
import { Readable } from "stream";

const assert = require("assert");

interface ICreateGuideWorld extends IBaseWorld {
  download?: Buffer;
}

class CreateGuideWorld extends BaseWorld implements ICreateGuideWorld {}

setWorldConstructor(CreateGuideWorld);

Given("User has a pdf and no images", async function (this: ICreateGuideWorld) {
  const page = this.page!;
  await page.goto("localhost:3000/stem");
});

When(
  "User creates a pdf study guide",
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
    assert.equal(pages, 3);
  },
);

async function streamToUint8Array(stream: Readable) {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Uint8Array);
  }
  return Buffer.concat(chunks);
}
