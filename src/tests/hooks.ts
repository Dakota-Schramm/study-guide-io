import { IBaseWorld } from "./world";
import { ChromiumBrowser, chromium } from "@playwright/test";
import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";

let browser: ChromiumBrowser;

BeforeAll(async () => {
  browser = await chromium.launch({ headless: false });
});

Before(async function (this: IBaseWorld) {
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: IBaseWorld) {
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async () => {
  await browser.close();
});
