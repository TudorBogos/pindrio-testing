import { expect, type Locator, type Page } from "@playwright/test";
import { activateAccount } from "../tests/email";
import { getActiveResourcesInfo } from "process";

export class pindrioActivationAccPage {
  readonly page: Page;
  readonly activSucc: Locator;
  readonly activFail: Locator;

  constructor(page: Page) {
    this.page = page;
    this.activSucc = page.getByText("Activation successful");
    this.activFail = page.getByText("Activation failed");
  }
}
