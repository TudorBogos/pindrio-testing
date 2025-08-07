import { expect, type Locator, type Page } from '@playwright/test';
import { acceptCookies, TestContext } from "../tests/helpers.spec";

export class pindrioProductsListPage {
    readonly page: Page;
    readonly wishlistIcons: Locator;
    readonly addToCartButtons: Locator;
    readonly itemsNames: Locator;

    constructor(page: Page) {
        this.page = page;
        //this.wishlistIcons=page.locator('button[aria-label="wishlist-icon"]');
        /*this.wishlistIcons = page.getByRole("link").getByLabel('wishlist-icon');
        this.addToCartButtons = page.getByRole("link").getByRole('button').filter({ hasNotText: 'wishlist-icon' }).filter({ hasNotText: 'shadow-md' }).filter({hasNot:this.wishlistIcons});*/
        //addToCart index este decalat cu +1
        this.wishlistIcons = page.getByRole("button").and(page.getByLabel('wishlist-icon'));
        this.addToCartButtons = page.locator('.uppercase.flex.items-center.justify-center.font-semibold.border.rounded').filter({hasNotText:'LOAD MORE'}).filter({hasNotText:'SUBSCRIBE'}).and(page.getByRole('button'));
        this.itemsNames = page.locator('p.w-full.h-\\[50px\\].mt-4.font-semibold[style*="display: -webkit-box"]');


    }
    /*async goto(category: string) {
        await this.page.goto(`https://ioto-marketplace.semiotic.eu/categories/${category}`);
        await this.page.waitForLoadState('domcontentloaded')
        await this.page.waitForLoadState('networkidle')

    }*/

    async assertVisibilityAndLogCounts() {
        try {
            // Wait for elements to be visible
            await expect(this.wishlistIcons.first()).toBeVisible({ timeout: 10000 });
            await expect(this.itemsNames.first()).toBeVisible({ timeout: 10000 });
            await expect(this.addToCartButtons.first()).toBeVisible({ timeout: 10000 });

            // Log counts
            const wishlistCount = await this.wishlistIcons.count();
            const itemsNamesCount = await this.itemsNames.count();
            const addToCartCount = await this.addToCartButtons.count();

            console.log('Wishlist Icons Count:', wishlistCount);
            console.log('Items Names Count:', itemsNamesCount);
            console.log('Add to Cart Buttons Count:', addToCartCount);
        } catch (error) {
            console.error('Visibility assertion failed:', error);}
    }




}
