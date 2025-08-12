import { expect, type Locator, type Page } from '@playwright/test';
import { acceptCookies, TestContext } from '../tests/helpers.spec';
import {pindrioLoginPage} from "./pindrioLogin";
import {pindrioCheckoutPage} from "./pindrioCheckoutPage";

export class pindrioCart {
  readonly page: Page;
  readonly itemsExist: Locator;
  readonly itemsDontExist: Locator;
  readonly removeButtons: Promise<Locator[]>;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemsExist = page.getByText("Product Summary");
    this.itemsDontExist = page.getByRole("heading", {
      name: "Your shopping bag is empty",
    });
    this.removeButtons = page
      .getByRole("button")
      .filter({ hasText: "Remove" })
      .all();
    this.checkoutButton = page.getByRole("button", { name: "Go to checkout" });
  }

  async goto() {
    await this.page.goto("https://ioto-marketplace.semiotic.eu/cart");
  }

    async removeEverythingFromCart() {
        await this.goto();
        await this.page.waitForLoadState("load");
        await this.page.waitForLoadState("networkidle");

        // Function to check if itemsExist is visible
        const itemsVisible = async () => {
            try {
                await this.itemsExist.waitFor({ state: "visible", timeout: 10000 });
                return true;
            } catch (e) {
                return false; // Return false if items are not visible within 10 seconds
            }
        };

        // Check for items visibility without throwing an error if they don't exist
        const itemsExist = await itemsVisible();

        if (itemsExist) {
            const removeButtons = await this.page
                .getByRole("button")
                .filter({ hasText: "Remove" })
                .all();

            if (removeButtons.length === 0) {
                // No remove buttons found
            } else {
                for (const button of removeButtons) {
                    await button.waitFor({ state: 'visible' });
                    try {
                        await button.click();
                        await this.page.waitForTimeout(1000);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        } else {
            // Handle case where items don't exist (no action needed)
        }
    }


    async performCheckout(){
        await this.goto();
        await this.page.waitForLoadState('load');

        await this.checkoutButton.click();
        await this.checkoutButton.click();
        await this.checkoutButton.click();
        await this.checkoutButton.click();
        await this.checkoutButton.click();
        await this.page.waitForLoadState("load");
        await this.page.waitForLoadState("networkidle");
        await expect(this.page.getByRole('heading', { name: 'Summary', exact: true }).locator('span').first()).toBeVisible();
        return new pindrioCheckoutPage(this.page);


    }
}
