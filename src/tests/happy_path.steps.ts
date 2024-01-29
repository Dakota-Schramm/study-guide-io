import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { PDFDocument } from "pdf-lib";
import { Given, When, Then } from "@cucumber/cucumber";
import path from "path";

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
    await page
      .getByLabel("Upload PDFs:")
      .setInputFiles(path.join(__dirname, "public", "myfile.pdf"));
    await page.getByRole("button", { name: "Next" }).click();
    await page.getByRole("button", { name: "Next" }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Complete" }).click();

    const download = await downloadPromise;
    const stream = await download.createReadStream();
    this.download = await streamToUint8Array(stream);
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
