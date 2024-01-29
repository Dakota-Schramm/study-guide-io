import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { Given, When, Then } from "@cucumber/cucumber";

interface ICreateGuideWorld extends World {
  download?: unknown;
}

class CreateGuideWorld extends World implements ICreateGuideWorld {}

setWorldConstructor(CreateGuideWorld);

Given("User has a pdf and no images", async function (this: ICreateGuideWorld) {
  return "pending";
  // const page = this.page!;
  // await page.goto("localhost:3000/stem");
});

When(
  "User creates a pdf study guide",
  async function (this: ICreateGuideWorld) {
    return "pending";

    // const page = this.page!;
    // await page.getByRole("button", { name: "Start" }).click();
    // await page.getByRole("textbox").click();
    // await page
    //   .getByRole("textbox")
    //   .setInputFiles("Design Gurus - Grokking the System Design Interview.pdf");
    // await page.getByRole("button", { name: "Next" }).click();
    // const downloadPromise = page.waitForEvent("download");
    // await page.getByRole("button", { name: "Complete" }).click();
    // this.download = await downloadPromise;
  },
);

Then(
  "User should have a pdf study guide with no additional pages\\/modifications",
  async function (this: ICreateGuideWorld) {
    return "pending";
    // console.log({ download: this.download });
  },
);
