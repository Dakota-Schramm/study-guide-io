import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { BrowserContext, Page } from "@playwright/test";

export interface IBaseWorld extends World {
  context?: BrowserContext;
  page?: Page;
}

export class BaseWorld extends World implements IBaseWorld {}

setWorldConstructor(BaseWorld);
