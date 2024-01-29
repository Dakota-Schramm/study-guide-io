import { IBaseWorld } from "./world";
import { ChromiumBrowser, chromium } from "@playwright/test";
import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";

let browser: ChromiumBrowser;

Before(
  { tags: "@browser and not @headless" },
  async function (this: IBaseWorld) {
    browser = await chromium.launch({ headless: false });
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
  },
);

Before({ tags: "@browser and @headless" }, async function (this: IBaseWorld) {
  browser = await chromium.launch({ headless: true });
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

After(
  { tags: "@browser and not @headless" },
  async function (this: IBaseWorld) {
    await this.page?.close();
    await this.context?.close();
    await browser.close();
  },
);
