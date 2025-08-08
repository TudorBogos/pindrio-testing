import { expect, type Locator, type Page } from '@playwright/test';
import { acceptCookies, TestContext } from '../tests/helpers.spec';
import {pindrioNetopiaPaymentsPage} from "./pindrioNetopiaPaymentsPage";

export class pindrioCheckoutPage{
    readonly page: Page;
    readonly aliasField: Locator;
    readonly nameField: Locator;
    readonly lastNameField: Locator;
    readonly phoneField: Locator;
    readonly emailField: Locator;
    readonly shippingAddressField: Locator;
    readonly apartmentSuiteField: Locator;
    readonly postalCodeField: Locator;
    readonly countyField: Locator;
    readonly countryField: Locator;
    readonly cityField: Locator;
    readonly saveButton: Locator;
    readonly checkboxSameAsBilling:Locator;
    readonly continueButton: Locator;
    readonly saveAddressButton: Locator;
    readonly savedCardSelector: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.aliasField=page.locator('input[name="shipping_address.alias"]')
        this.nameField=page.locator('input[name="shipping_address.first_name"]');
        this.lastNameField=page.locator('input[name="shipping_address.last_name"]')
        this.phoneField=page.locator('input[name="shipping_address.phone"]')
        this.emailField=page.locator('input[name="email"]')
        this.shippingAddressField=page.locator('input[name="shipping_address.address_1"]')
        this.apartmentSuiteField=page.locator('input[name="shipping_address.address_2"]')
        this.postalCodeField=page.locator('input[name="shipping_address.postal_code"]')
        this.countyField=page.locator('#county-select');
        this.countryField=page.locator('select[name="shipping_address.country_code"]')
        this.cityField=page.locator('#cities-select');
        this.saveButton=page.getByRole('button', { name: 'Save' })
        this.continueButton=page.getByRole('button', { name: 'Continue' })
        this.checkboxSameAsBilling = page.getByRole('checkbox', { name: '✓ Same as Billing Address' });
        this.saveAddressButton=page.getByRole('checkbox', { name: 'Save address in account' });
        this.savedCardSelector=page.getByRole('button', { name: 'Card ending in 5098 Expires' });
        this.checkoutButton=page.getByRole('button', { name: 'Checkout' })

    }

  async goto() {
    await this.page.goto("https://ioto-marketplace.semiotic.eu/checkout");
  }

    async fillInfo(ctx:TestContext){
        await this.page.waitForLoadState('load');;

        if (await this.nameField.isVisible()){
            await this.nameField.click({ force: true });
            await this.nameField.fill(ctx.firstName);
        }
        if (await this.lastNameField.isVisible()){
            await this.lastNameField.click({ force: true });
            await this.lastNameField.fill(ctx.lastName);
        }

        if (await this.phoneField.isVisible()){
            await this.phoneField.click({ force: true });
            await this.phoneField.fill(ctx.phone);
        }
        if (await this.emailField.isVisible()){
            await this.emailField.click({ force: true });
            await this.emailField.fill(ctx.email);
        }
        if (await this.shippingAddressField.isVisible()){
            await this.shippingAddressField.click({ force: true });
            await this.shippingAddressField.fill(ctx.shippingAddress);
        }
        if (await this.apartmentSuiteField.isVisible()){
            await this.apartmentSuiteField.click({ force: true });
            await this.apartmentSuiteField.fill(ctx.apartmentSuite);
        }
        if (await this.postalCodeField.isVisible()){
            await this.postalCodeField.click({ force: true });
            await this.postalCodeField.fill(ctx.postalCode);
        }
        if (await this.countyField.isVisible()){
            await this.countyField.click({ force: true });
            await this.countyField.selectOption('Galați');
        }
        if (await this.countryField.isVisible()){
            await this.countryField.click({ force: true });
            await this.countryField.selectOption('Romania');
        }
        if (await this.cityField.isVisible()){
            await this.cityField.click({ force: true });
            await this.cityField.selectOption('Galaţi');
        }


        if (await this.checkboxSameAsBilling.isVisible()) {
            const isCheckedBill = await this.checkboxSameAsBilling.isChecked();

            if (!isCheckedBill) {
                await this.checkboxSameAsBilling.check();
            }
        }

        if (await this.saveAddressButton.isVisible()) {
            const isCheckedSave = await this.saveAddressButton.isChecked();

            if (!isCheckedSave) {
                /*await this.saveAddressButton.check();*/
            }
        }
        if (await this.aliasField.isVisible()) {
            await this.aliasField.click({ force: true });
            await this.aliasField.fill(ctx.alias);
        }

        if (await this.saveButton.isVisible()) {
            await this.saveButton.click();
        }
        await this.page.waitForLoadState('load');


        await this.continueButton.click();

        await this.page.waitForLoadState('load');



    }
    async proceedCheckout(){
        await this.page.waitForLoadState('load');
        await this.savedCardSelector.isVisible();
        await this.savedCardSelector.click();

        await this.page.waitForLoadState('load');
        await this.checkoutButton.isVisible();
        await this.checkoutButton.click();

        await this.page.waitForLoadState('load');

        if (await this.page.getByRole('button', {name: 'Send anyway'}).isVisible()){
            await this.page.getByRole('button', { name: 'Send anyway' }).click();
        }
        return new pindrioNetopiaPaymentsPage(this.page);
    }
}