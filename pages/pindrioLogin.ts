import { expect, type Locator, type Page } from '@playwright/test';
import {acceptCookies, TestContext} from "../tests/helpers.spec";

export class pindrioLoginPage {
    readonly page: Page;
    readonly passwordTextBox: Locator;
    readonly logInButton: Locator;
    readonly emailTextBox: Locator;


    constructor(page: Page) {
        this.page = page;
        this.emailTextBox = page.locator('#main').getByRole('textbox', { name: 'Email' });
        this.passwordTextBox = page.getByRole('textbox', { name: 'Password' });
        this.logInButton=page.getByRole('button', { name: 'Log in', exact: true })

    }

    async goto() {
        await this.page.goto('https://ioto-marketplace.semiotic.eu/account/login');
    }

    async login( ctx:TestContext){
        try {
            await this.goto();


            await acceptCookies(this.page);

            await this.emailTextBox.waitFor({ state: 'visible', timeout: 10000 });
            await this.emailTextBox.click();
            await this.emailTextBox.fill(ctx.email);

            await this.passwordTextBox.waitFor({ state: 'visible', timeout: 10000 });
            await this.passwordTextBox.click();
            await this.passwordTextBox.fill(ctx.password);

            await this.logInButton.click();

            await this.page.waitForLoadState('load')

        } catch (error) {
            console.error('An error occurred during the login process:', error);
            throw error;
        }
    }

}