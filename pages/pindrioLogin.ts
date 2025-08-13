import { expect, type Locator, type Page } from "@playwright/test";
import { acceptCookies, TestContext } from "../tests/helpers";

/*
const _request = page.waitForResponse(
  (res) =>
    res.request().method() === "GET" &&
    res.status() === 200 &&
    res.url().includes("parte din URL ")
);

  await reservations_page_request;
  */

export class pindrioLoginPage {
  readonly page: Page;
  readonly passwordTextBox: Locator;
  readonly logInButton: Locator;
  readonly emailTextBox: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailTextBox = page
      .locator("#main")
      .getByRole("textbox", { name: "Email" });
    this.passwordTextBox = page.getByRole("textbox", { name: "Password" });
    this.logInButton = page.getByRole("button", {
      name: "Log in",
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("https://ioto-marketplace.semiotic.eu/account/login");
  }

  async login(ctx: TestContext) {
    try {
      await this.goto();

      await acceptCookies(this.page);

      await this.emailTextBox.waitFor({ state: "visible", timeout: 10000 });
      await this.emailTextBox.click();
      await this.emailTextBox.fill(ctx.email);

      await this.passwordTextBox.waitFor({ state: "visible", timeout: 10000 });
      await this.passwordTextBox.click();
      await this.passwordTextBox.fill(ctx.password);

      const _requestLogin = this.page.waitForResponse(
        (res) =>
          res.request().method() === "POST" &&
          res.status() === 200 &&
          res.url().includes("/auth")
      );

      const _getLogin = this.page.waitForResponse(
        (res) =>
          res.request().method() === "GET" &&
          res.status() === 200 &&
          res.url().includes("/me")
      );

      await this.logInButton.click();

      const responseAuth = await _requestLogin;
      const responseGet = await _getLogin;
      if (!responseAuth.ok()) {
        console.error("Auth response:", responseAuth.status());
      } else if (!responseGet.ok()) {
        console.error("Get response:", responseGet.status());
      }

      const responseDataAuth = await responseAuth.json();
      if (responseDataAuth.error) {
        throw new Error(`Login failed: ${responseDataAuth.error}`);
      }
      const responseDataGet = await responseGet.json();
      if (responseDataGet.error) {
        throw new Error(`Get user data failed: ${responseDataGet.error}`);
      }
      // Check if responseDataGet.customer.id matches the responseDataAuth.customer.id
      if (responseDataGet.customer.id !== responseDataAuth.customer.id) {
        throw new Error("Customer ID mismatch");
      } else {
        console.log(
          "Login successful, customer ID matches: " +
            responseDataGet.customer.id
        );
      }

      await this.page.waitForLoadState("load");
    } catch (error) {
      console.error("An error occurred during the login process:", error);
      throw error;
    }
  }
}
