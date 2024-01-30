import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { ChromiumBrowser, } from "@playwright/test";
import { BrowserContext, Page } from "@playwright/test";

export interface IBaseWorld extends World {
  browser?: ChromiumBrowser;
  context?: BrowserContext;
  page?: Page;
}

export class BaseWorld extends World implements IBaseWorld {}

setWorldConstructor(BaseWorld);
