import {expect, Locator, Page} from "@playwright/test";
import {TestContext} from "../tests/helpers.spec";
import {pindrioOrderConfirmedPage} from "./pindrioOrderConfirmedPage";

export class pindrioNetopiaPaymentsPage{
    readonly page: Page;
    readonly cardNoField: Locator;
    readonly cardExpirationField: Locator;
    readonly cardCVCField: Locator;
    readonly cardNameField: Locator;
    readonly payButton: Locator;
    readonly returnToStoreButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cardNoField=page.getByRole('textbox', { name: '0000 0000 0000' })
        this.cardExpirationField=page.getByRole('textbox', { name: 'LL/AA' });
        this.cardCVCField=page.getByRole('textbox', { name: '000', exact: true })
        this.cardNameField=page.getByRole('textbox', { name: 'Maria Popescu' });
        this.payButton = page.getByRole('button', { name: /^Plătește \d+\.\d+ RON$/ });
        this.returnToStoreButton=page.getByRole('link', { name: 'Înapoi la magazin' });

    }
    async fillCardInfo(ctx:TestContext){
        await this.page.waitForLoadState('load');

        await this.cardNameField.click({ force: true });
        await this.cardNameField.fill(ctx.cardName);

        await this.cardCVCField.click({ force: true });
        await this.cardCVCField.fill(ctx.cardCVC);

        await this.cardNoField.click({ force: true });
        await this.cardNoField.fill(ctx.cardNo);

        await this.cardExpirationField.click({ force: true });
        await this.cardExpirationField.fill(ctx.cardDate);

        await this.payButton.click();

        await this.page.waitForLoadState('load');

        return new pindrioOrderConfirmedPage(this.page);

/*        await expect(this.page.getByText('Order Confirmed')).toBeVisible({timeout: 20000});
        await this.page.waitForLoadState('load');

        const quantityLocators = this.page.locator('text=/Quantity: \\d+/');

        const count = await quantityLocators.count();

        expect(count).toBe(1);

        if (count === 1) {
            const firstQuantityText = await quantityLocators.first().textContent();

            expect(firstQuantityText?.trim()).toBe('Quantity: 1');
        }

        const productName = this.page.locator('h3').first();

        await expect(productName).toContainText('Wireless Game Joystick Controller Left and Right Handle for Nintendo Switch Pro');*/
    }
}