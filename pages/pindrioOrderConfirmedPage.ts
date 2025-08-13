import { expect, Locator, Page } from "@playwright/test";
import { TestContext } from "../tests/helpers.spec";

export class pindrioOrderConfirmedPage {
  readonly page: Page;
  readonly quantityLocators: Locator;
  readonly products: Locator;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quantityLocators = this.page.locator("text=/Quantity: \\d+/");
    this.products = this.page.locator("h3");
    this.header = page.getByText("Order Confirmed");
  }

  async goto() {
    await this.page.goto(
      "https://ioto-marketplace.semiotic.eu/order/confirmed"
    );
  }

  async verifyItem(name: string, quant: number) {
    await this.page.waitForLoadState("load");
    await this.page.waitForSelector("text=Order Confirmed");
    await expect(this.header).toBeVisible();

    const count = await this.quantityLocators.count();
    expect(count).toBeGreaterThan(0);

    const firstQuantityText = await this.quantityLocators.first().textContent();
    expect(firstQuantityText?.trim()).toBe(`Quantity: ${quant}`);

    const productName = this.products.first();
    await expect(productName).toContainText(name);
  }
}
