import { expect, type Locator, type Page } from '@playwright/test';
import { acceptCookies, TestContext } from '../tests/helpers.spec';

export class pindrioCart {
    readonly page: Page;
    readonly itemsExist: Locator;
    readonly itemsDontExist: Locator;
    readonly removeButtons: Promise<Locator[]>;

    constructor(page: Page) {
        this.page = page;
        this.itemsExist = page.getByText('Product Summary');
        this.itemsDontExist = page.getByRole('heading', { name: 'Your shopping bag is empty' });
        this.removeButtons = page.getByRole('button').filter({ hasText: 'Remove' }).all();
    }

    async goto() {
        await this.page.goto('https://ioto-marketplace.semiotic.eu/cart');
    }

    async removeEverythingFromCart() {
        await this.goto();
        await this.page.waitForLoadState('load');
        await this.page.waitForLoadState('networkidle');

        await this.itemsExist.waitFor({ state: 'visible' }).catch(e => {
            console.log('No items found in the cart.');
        });

        if (await this.itemsExist.isVisible()) {
            console.log('Products exist in the cart.');

            const removeButtons = await this.page.getByRole('button').filter({ hasText: 'Remove' }).all();
            console.log(`Found ${removeButtons.length} remove buttons.`);

            if (removeButtons.length === 0) {
                console.log('Cart is empty.');
            } else {
                for (const button of removeButtons) {
                    await button.waitFor({ state: 'visible' });
                    console.log('Button is visible, attempting to click.');
                    try {
                        await button.click();
                        console.log('Successfully clicked the remove button.');
                        await this.page.waitForTimeout(1000);
                    } catch (error) {
                        console.error('Failed to click the remove button:', error);
                    }
                }
            }
        } else if (await this.itemsDontExist.isVisible()) {
            console.log('No products in the cart.');
        }
    }

}
