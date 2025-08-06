import { expect, type Locator, type Page } from "@playwright/test";
import { acceptCookies, TestContext } from "../tests/helpers.spec";

export class pindrioSignUpPage {
  readonly page: Page;
  readonly emailTextBox: Locator;
  readonly firstNameTextBox: Locator;
  readonly lastNameTextBox: Locator;
  readonly phoneTextBox: Locator;
  readonly passwordTextBox: Locator;
  readonly confirmPasswordTextBox: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailTextBox = page
      .locator("#main")
      .getByRole("textbox", { name: "Email" });
    this.firstNameTextBox = page.getByRole("textbox", { name: "First Name" });
    this.lastNameTextBox = page.getByRole("textbox", { name: "Last Name" });
    this.phoneTextBox = page.getByRole("textbox", { name: "Phone" });
    this.passwordTextBox = page.getByRole("textbox", {
      name: "Password",
      exact: true,
    });
    this.confirmPasswordTextBox = page.getByRole("textbox", {
      name: "Confirm password",
    });
    this.createAccountButton = page.getByRole("button", {
      name: "Create account",
    });
  }

  async goto() {
    await this.page.goto(
      "https://ioto-marketplace.semiotic.eu/account/register"
    );
  }

  async signUp(ctxUnique: TestContext) {
    try {
      await this.goto();
      await acceptCookies(this.page);

      await this.emailTextBox.waitFor({ state: "visible" });
      await this.emailTextBox.click();
      await this.emailTextBox.fill(ctxUnique.email);

      await this.firstNameTextBox.click();
      await this.firstNameTextBox.fill(ctxUnique.firstName);

      await this.lastNameTextBox.click();
      await this.lastNameTextBox.fill(ctxUnique.lastName);

      await this.phoneTextBox.click();
      await this.phoneTextBox.fill(ctxUnique.phone);

      await this.passwordTextBox.click();
      await this.passwordTextBox.fill(ctxUnique.password);

      await this.confirmPasswordTextBox.waitFor({ state: "visible" });
      await this.confirmPasswordTextBox.click({ force: true });
      await this.confirmPasswordTextBox.fill(ctxUnique.password);

      await this.page.getByRole("checkbox").nth(1).click();
      await this.createAccountButton.click();
    } catch (error) {
      console.error("An error occurred during the sign-up process:", error);
      throw error;
    }
  }
}
