import { expect, Locator, Page } from "@playwright/test";
import { TestContext } from "../tests/helpers";
import { pindrioOrderConfirmedPage } from "./pindrioOrderConfirmedPage";

export class pindrioNetopiaPaymentsPage {
  readonly page: Page;
  readonly cardNoField: Locator;
  readonly cardExpirationField: Locator;
  readonly cardCVCField: Locator;
  readonly cardNameField: Locator;
  readonly payButton: Locator;
  readonly returnToStoreButton: Locator;
  readonly phoneNRField: Locator;
  readonly continueButton: Locator;
  readonly emailField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cardNoField = page.getByRole("textbox", { name: "0000 0000 0000" });
    this.cardExpirationField = page.getByRole("textbox", { name: "LL/AA" });
    this.cardCVCField = page.getByRole("textbox", { name: "000", exact: true });
    this.cardNameField = page.getByRole("textbox", { name: "Maria Popescu" });
    this.payButton = page.getByRole("button", {
      name: /^Plătește \d+\.\d+ RON$/,
    });
    this.returnToStoreButton = page.getByRole("link", {
      name: "Înapoi la magazin",
    });
    this.phoneNRField = page.getByRole("textbox", { name: "07xxxxxxxx" });
    this.continueButton = page.getByRole("button", { name: /^Continuă$/ });
    this.emailField = page.getByRole("textbox", {
      name: "popescu@myemail.com",
    });
  }

  async fillCardInfo(ctx: TestContext) {
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(5000);

    await expect(this.phoneNRField).toBeVisible();
    await expect(this.emailField).toBeVisible();

    await this.phoneNRField.clear();
    await this.phoneNRField.fill(ctx.phone);

    await this.emailField.clear();
    await this.emailField.fill(ctx.email);

    if (await this.continueButton.isVisible()) {
      await expect(this.continueButton).toBeEnabled();
      await this.continueButton.click();
    }

    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);

    await expect(this.cardNameField).toBeVisible();
    await this.cardNameField.fill(ctx.cardName);

    await expect(this.cardCVCField).toBeVisible();
    await this.cardCVCField.fill(ctx.cardCVC);

    await expect(this.cardNoField).toBeVisible();
    await this.cardNoField.fill(ctx.cardNo);

    await expect(this.cardExpirationField).toBeVisible();
    await this.cardExpirationField.fill(ctx.cardDate);

    await expect(this.payButton).toBeEnabled();
    await this.payButton.click();
    await this.page.waitForURL("**/order/confirmed");
    return new pindrioOrderConfirmedPage(this.page);
  }
}
