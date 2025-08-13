import { expect, type Locator, type Page } from "@playwright/test";
import { acceptCookies, TestContext } from "../tests/helpers";
import { pindrioLoginPage } from "./pindrioLogin";
import { pindrioCheckoutPage } from "./pindrioCheckoutPage";

export class pindrioWishlistPage {
  readonly page: Page;
  readonly itemsList: Promise<Array<Locator>>;
  readonly noOfItemsInWishlist: Promise<number>;
  readonly itemsDontExist: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemsDontExist = this.page.getByText("Your wish list is empty");
    this.itemsList = this.getItemsList();
    this.noOfItemsInWishlist = this.getWishlistCount();
  }

  private async getItemsList(): Promise<Array<Locator>> {
    await this.page.waitForLoadState("load");

    if (!(await this.itemsDontExist.isVisible())) {
      return this.page.locator(".font-semibold.line-clamp-3").all();
    } else {
      console.log("No products in wishlist");
    }
  }

  private async getWishlistCount(): Promise<number> {
    const wishlistCountSpan = this.page
      .locator("#wishlist-widget-button span")
      .filter({ hasText: /\(\d+\)/ })
      .first();
    if (await wishlistCountSpan.isVisible()) {
      const wishlistCountText = await wishlistCountSpan.textContent();
      const wishlistCountMatch = wishlistCountText?.match(/\d+/);
      return wishlistCountMatch ? parseInt(wishlistCountMatch[0], 10) : 0;
    } else {
      return 0;
    }
  }

  async goto() {
    await this.page.goto("https://ioto-marketplace.semiotic.eu/wishlist");
    await this.page.waitForLoadState("load");
  }

  async removeEverythingFromWishlist() {
    await this.goto();
    await this.page.waitForTimeout(3000);
    if (await this.itemsDontExist.isVisible()) {
      return;
    } else {
      const removeButtons = await this.page
        .getByRole("button")
        .filter({ hasText: "Remove" })
        .all();
      for (const button of removeButtons) {
        await button.waitFor({ state: "visible" });
        try {
          await button.click();
          await this.page.waitForLoadState("load");
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}
