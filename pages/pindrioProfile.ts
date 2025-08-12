import { expect, type Locator, type Page } from '@playwright/test';
import { acceptCookies, TestContext } from "../tests/helpers.spec";

export class pindrioProfilePage {
  readonly page: Page;
  readonly profileButton: Locator;
  readonly accountOverviewButton: Locator;
  readonly profileLink: Locator;
  readonly firstNameTextBox: Locator;
  readonly lastNameTextBox: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileButton = page.getByRole("button", { name: /Hello! \w+ \w+/ });
    this.accountOverviewButton = page.getByRole("link", {
      name: "Account Overview",
    });
    this.profileLink = page.getByRole("link", { name: "Profile" });
    this.firstNameTextBox = page.locator('input[name="first_name"]');
    this.lastNameTextBox = page.locator('input[name="last_name"]');
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
  }

  async goto() {
    await this.page.goto("https://ioto-marketplace.semiotic.eu/account");
  }

  async navigateToProfile() {
    await this.page.goto("https://ioto-marketplace.semiotic.eu");
    await this.profileButton.click();
    await this.profileButton.click();
    await this.profileButton.click();
    await this.accountOverviewButton.click();
    await expect(this.profileLink).toBeVisible();
    await this.profileLink.click();
  }

  async resetName(ctx: TestContext) {
    await this.goto();

    await expect(this.profileLink).toBeVisible();
    await this.profileLink.click();

        await expect(this.firstNameTextBox).toBeVisible();
        await this.firstNameTextBox.click();
        await this.firstNameTextBox.fill(ctx.firstName);

        await expect(this.lastNameTextBox).toBeVisible();
        await this.lastNameTextBox.click();
        await this.lastNameTextBox.fill(ctx.lastName);

    await this.page.waitForTimeout(3000);

    if (!(await this.saveButton.isVisible())) {
      await this.cancelButton.isEnabled();
      await this.cancelButton.click();
    } else {
      await this.saveButton.isEnabled();
      await this.saveButton.click();
    }
  }

  async editProfileRevert(ctx: TestContext) {
    await acceptCookies(this.page);
    await this.resetName(ctx);
    await this.goto();

    await expect(this.profileLink).toBeVisible();
    await this.profileLink.click();

    await expect(this.firstNameTextBox).toBeVisible();

    await this.firstNameTextBox.click();
    await this.firstNameTextBox.fill("TestName");

    await expect(this.lastNameTextBox).toBeVisible();
    await this.lastNameTextBox.click();
    await this.lastNameTextBox.fill("TestLastName");

    await this.page.waitForTimeout(3000);


        const _requestEditProfile = this.page.waitForResponse(
            (res) =>
                res.request().method() === "POST" &&
                res.status() === 200 &&
                res.url().includes("/proxy/api/v1/store/customers/me")
        );




        await this.saveButton.waitFor({ state: 'visible' });
        await this.saveButton.isEnabled();
        await this.saveButton.click();


        const responseEdit = await _requestEditProfile;


        if (!responseEdit.ok()) {
            console.error("API Failed when editing profile:", responseEdit.status());
        } else {
            const responseData: { customer: { id: string; first_name: string; last_name: string } } = await responseEdit.json();

            if (responseData.customer.first_name === "TestName" && responseData.customer.last_name === "TestLastName") {
                console.log("The response data contains the specified values.");
            } else {
                console.error("The response data does not contain the specified values.");
            }
        }

        await expect(this.firstNameTextBox).toHaveValue('TestName');
        await expect(this.lastNameTextBox).toHaveValue('TestLastName');


        await this.goto();

        await expect(this.profileLink).toBeVisible()
        await  this.profileLink.click()

        await expect(this.firstNameTextBox).toBeVisible();


        await this.lastNameTextBox.click();
        await this.lastNameTextBox.fill(ctx.lastName);

        await this.firstNameTextBox.click();
        await this.firstNameTextBox.fill(ctx.firstName);

    await this.lastNameTextBox.click();
    await this.lastNameTextBox.clear();
    await this.lastNameTextBox.fill("Munteanu");
      await this.saveButton.waitFor({ state: "visible" });
      await this.saveButton.isEnabled();
      await this.saveButton.click();
    await this.page.reload({ waitUntil: "load" });



        await expect(this.firstNameTextBox).toHaveValue(ctx.firstName);
        await expect(this.lastNameTextBox).toHaveValue(ctx.lastName);
    }

}
