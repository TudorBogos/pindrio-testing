import { expect, type Locator, type Page } from '@playwright/test';
import { acceptCookies, TestContext } from '../tests/helpers.spec';
import {pindrioLoginPage} from "./pindrioLogin";
import {pindrioChechoutPage} from "./pindrioCheckoutPage";

export class pindrioWishlistPage {
    readonly page: Page;
    readonly itemsList: Promise<Array<Locator>>;
    readonly noOfItemsInWishlist: Promise<number>;

    constructor(page: Page) {
        this.page = page;
        this.itemsList = page.locator('.font-semibold.line-clamp-3').all();
        this.noOfItemsInWishlist = this.getWishlistCount();
    }

    private async getWishlistCount(): Promise<number> {
        const wishlistCountSpan = this.page.locator('#wishlist-widget-button span').filter({ hasText: /\(\d+\)/ });
        const wishlistCountText = await wishlistCountSpan.textContent();
        const wishlistCountMatch = wishlistCountText?.match(/\d+/);
        return wishlistCountMatch ? parseInt(wishlistCountMatch[0], 10) : 0;
    }

    async goto(){
        this.page.goto('https://ioto-marketplace.semiotic.eu/wishlist');
        await this.page.waitForLoadState('domcontentloaded')

    }


}


