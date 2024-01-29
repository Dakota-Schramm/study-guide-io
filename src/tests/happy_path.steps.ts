import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { PDFDocument } from "pdf-lib";
import { Given, When, Then } from "@cucumber/cucumber";
import path from "path";

import { BaseWorld, IBaseWorld } from "./world";
import { getPageCount } from "../app/(guides)/_guide_creation/pdf/createPdf";

const assert = require("assert");

interface ICreateGuideWorld extends IBaseWorld {
  download?: string;
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
    await page.getByRole("textbox").click();
    await page
      .getByLabel("Upload file")
      .setInputFiles(path.join(__dirname, "myfile.pdf"));
    await page.getByRole("textbox").setInputFiles("/public/pdf-test.pdf");
    await page.getByRole("button", { name: "Next" }).click();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Complete" }).click();
    const download = await downloadPromise;
    this.download = await download.path();
  },
);

Then(
  "User should have a pdf study guide with no additional pages\\/modifications",
  async function (this: ICreateGuideWorld) {
    console.log({ download: this.download });
    if (!this.download) return;

    const existingPdfBytes = await fetch(this.download).then((res) =>
      res.arrayBuffer(),
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = await getPageCount(pdfDoc);
    assert.equal(pages, 1);
  },
);
