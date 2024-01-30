import { IBaseWorld } from "./world";
import { ChromiumBrowser, chromium } from "@playwright/test";
import { After, AfterAll, Before, BeforeAll } from "@cucumber/cucumber";

Before(
  { tags: "@browser and not @headless and not @integration" },
  async function (this: IBaseWorld) {
    console.log("running before tags:@browser and not @headless");
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  },
);

Before(
  { tags: "@browser and @headless and not @integration" },
  async function (this: IBaseWorld) {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  },
);

After(
  { tags: "@browser and not @headless" },
  async function (this: IBaseWorld) {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  },
);
