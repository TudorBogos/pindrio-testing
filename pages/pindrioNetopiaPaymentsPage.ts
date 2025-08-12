import { expect, Locator, Page } from "@playwright/test";
import { TestContext } from "../tests/helpers.spec";
import { pindrioOrderConfirmedPage } from "./pindrioOrderConfirmedPage";

export class pindrioNetopiaPaymentsPage {
    readonly page: Page;
    readonly cardNoField: Locator;
    readonly cardExpirationField: Locator;
    readonly cardCVCField: Locator;
    readonly cardNameField: Locator;
    readonly payButton: Locator;
    readonly returnToStoreButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cardNoField = page.getByRole('textbox', { name: '0000 0000 0000' });
        this.cardExpirationField = page.getByRole('textbox', { name: 'LL/AA' });
        this.cardCVCField = page.getByRole('textbox', { name: '000', exact: true });
        this.cardNameField = page.getByRole('textbox', { name: 'Maria Popescu' });
        this.payButton = page.getByRole('button', { name: /^Plătește \d+\.\d+ RON$/ });
        this.returnToStoreButton = page.getByRole('link', { name: 'Înapoi la magazin' });
    }

    async fillCardInfo(ctx: TestContext) {
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(5000);

        await expect(this.cardNameField).toBeVisible();
        await this.cardNameField.fill(ctx.cardName);

        await expect(this.cardCVCField).toBeVisible();
        await this.cardCVCField.fill(ctx.cardCVC);

        await expect(this.cardNoField).toBeVisible();
        await this.cardNoField.fill(ctx.cardNo);

        await expect(this.cardExpirationField).toBeVisible();
        await this.cardExpirationField.fill(ctx.cardDate);

        await expect(this.payButton).toBeEnabled();
        await this.payButton.click();
        await this.page.waitForTimeout(7000);
        return new pindrioOrderConfirmedPage(this.page);
    }
}
