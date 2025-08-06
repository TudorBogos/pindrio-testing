import { expect, type Locator, type Page } from "@playwright/test";
import { acceptCookies, TestContext } from "../tests/helpers.spec";

export class pindrioChechoutPage {
  readonly page: Page;
  readonly aliasField: Locator;
  readonly nameField: Locator;
  readonly lastNameField: Locator;
  readonly phoneField: Locator;
  readonly emailField: Locator;
  readonly shippingAddressField: Locator;
  readonly apartmentSuiteField: Locator;
  readonly postalCodeField: Locator;
  readonly countyField: Locator;
  readonly countryField: Locator;
  readonly cityField: Locator;
  readonly saveButton: Locator;
  readonly checkboxSameAsBilling: Locator;

  constructor(page: Page) {
    this.page = page;
    this.aliasField = page.locator('input[name="shipping_address.alias"]');
    this.nameField = page.locator('input[name="shipping_address.last_name"]');
    this.lastNameField = page.locator(
      'input[name="shipping_address.last_name"]'
    );
    this.phoneField = page.locator('input[name="shipping_address.phone"]');
    this.emailField = page.locator('input[name="email"]');
    this.shippingAddressField = page.locator(
      'input[name="shipping_address.address_1"]'
    );
    this.apartmentSuiteField = page.locator(
      'input[name="shipping_address.address_2"]'
    );
    this.postalCodeField = page.locator(
      'input[name="shipping_address.postal_code"]'
    );
    this.countyField = page.locator("#county-select");
    this.countryField = page.locator(
      'select[name="shipping_address.country_code"]'
    );
    this.cityField = page.locator("#cities-select");
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.checkboxSameAsBilling = page.getByRole("checkbox", {
      name: "✓ Same as Billing Address",
    });
  }

  async goto() {
    await this.page.goto("https://ioto-marketplace.semiotic.eu/checkout");
  }

  async fillInfo(ctx: TestContext) {
    this.goto();
    await this.page.waitForLoadState("load");
    await this.aliasField.click({ force: true });
    await this.aliasField.fill(ctx.alias);

    await this.nameField.click({ force: true });
    await this.nameField.fill(ctx.firstName);

    await this.lastNameField.click({ force: true });
    await this.lastNameField.fill(ctx.lastName);

    await this.phoneField.click({ force: true });
    await this.phoneField.fill(ctx.phone);

    await this.emailField.click({ force: true });
    await this.emailField.fill(ctx.email);

    await this.shippingAddressField.click({ force: true });
    await this.shippingAddressField.fill(ctx.shippingAddress);

    await this.apartmentSuiteField.click({ force: true });
    await this.apartmentSuiteField.fill(ctx.apartmentSuite);

    await this.postalCodeField.click({ force: true });
    await this.postalCodeField.fill(ctx.postalCode);

    await this.countyField.click({ force: true });
    await this.countyField.selectOption("Galați");

    await this.countryField.click({ force: true });
    await this.countryField.selectOption("Romania");

    await this.cityField.click({ force: true });
    await this.cityField.selectOption("Galaţi");

    const isChecked = await this.checkboxSameAsBilling.isChecked();

    if (!isChecked) {
      await this.checkboxSameAsBilling.check();
    }
    await this.saveButton.click();
  }
}
