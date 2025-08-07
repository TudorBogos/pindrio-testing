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
        this.profileButton = page.getByRole('button', { name: /Hello! \w+ \w+/ });
        this.accountOverviewButton = page.getByRole('link', { name: 'Account Overview' });
        this.profileLink = page.getByRole('link', { name: 'Profile' });
        this.firstNameTextBox = page.locator('input[name="first_name"]');
        this.lastNameTextBox = page.locator('input[name="last_name"]');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async goto() {
        await this.page.goto('https://ioto-marketplace.semiotic.eu/account');
    }

    async navigateToProfile() {
        await this.page.goto('https://ioto-marketplace.semiotic.eu');
        await this.profileButton.click();
        await this.profileButton.click();
        await this.profileButton.click();
        await this.accountOverviewButton.click();
        await expect(this.profileLink).toBeVisible();
        await this.profileLink.click();
    }

    async resetName(ctx: TestContext) {
        await this.goto();

        await expect(this.profileLink).toBeVisible()
        await  this.profileLink.click()

        await expect(this.firstNameTextBox).toBeVisible();
        await this.firstNameTextBox.click();
        await this.firstNameTextBox.fill('Andrei');

        await expect(this.lastNameTextBox).toBeVisible();
        await this.lastNameTextBox.click();
        await this.lastNameTextBox.fill('Munteanu');

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

        await expect(this.profileLink).toBeVisible()
        await  this.profileLink.click()

        await expect(this.firstNameTextBox).toBeVisible();

        await this.firstNameTextBox.click();
        await this.firstNameTextBox.fill('TestName');

        await expect(this.lastNameTextBox).toBeVisible();
        await this.lastNameTextBox.click();
        await this.lastNameTextBox.fill('TestLastName');

        await this.page.waitForTimeout(3000);

        await this.saveButton.waitFor({ state: 'visible' });
        await this.saveButton.isEnabled();
        await this.saveButton.click();

        await expect(this.firstNameTextBox).toHaveValue('TestName');
        await expect(this.lastNameTextBox).toHaveValue('TestLastName');


        await this.goto();

        await expect(this.profileLink).toBeVisible()
        await  this.profileLink.click()

        await expect(this.firstNameTextBox).toBeVisible();


        await this.lastNameTextBox.click();
        await this.lastNameTextBox.fill('Munteanu');

        await this.firstNameTextBox.click();
        await this.firstNameTextBox.fill('Andrei');

        await this.page.waitForTimeout(3000);

        await this.saveButton.waitFor({ state: 'visible' });
        await this.saveButton.isEnabled();
        await this.saveButton.click();

        await expect(this.firstNameTextBox).toHaveValue('Andrei');
        await expect(this.lastNameTextBox).toHaveValue('Munteanu');
    }

}
