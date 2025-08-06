import { expect, type Locator, type Page } from '@playwright/test';
import {acceptCookies, TestContext} from "../tests/helpers.spec";
import {pindrioLoginPage} from "./pindrioLogin";

export class pindrioHomePage {
    readonly page: Page;
    readonly logInSignUp: Locator;
    readonly signUp: Locator;
    readonly logIn: Locator;
    readonly btnAllProducts: Locator;
    readonly btnElectroniceTab: Locator;
    readonly btnSeeAllElectronice: Locator;
    readonly loggedInButton: Locator;
    readonly signOutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logInSignUp=page.getByRole('button', { name: 'Log in/Join IoTo club' });
        this.signUp=page.getByRole('button', { name: 'Join IoTo club', exact: true });
        this.logIn=page.getByRole('button', { name: 'Log in', exact: true });
        this.btnAllProducts = page.getByRole('button', { name: 'open menu' });
        this.btnElectroniceTab =page.getByRole('button', { name: 'Electronice', exact: true });
        this.btnSeeAllElectronice=page.getByRole('button', { name: 'See all products' }).nth(0);
        this.loggedInButton = page.getByRole('button', { name: /Hello! \w+ \w+/ });
        this.signOutButton = page.getByRole('button', { name: 'Sign out' });
    }

    async goto() {
        await this.page.goto('https://ioto-marketplace.semiotic.eu/');
    }

    async logOut(){
            await this.goto();
            await acceptCookies(this.page);
            await this.loggedInButton.click();
            await this.signOutButton.click();
            await expect(this.page.getByRole('button', { name: 'Log in/Join IoTo club' })).toBeVisible();

        }

    async goToLogIn(){
        await this.goto()
        await acceptCookies(this.page);
        await this.logInSignUp.click();
        await this.logIn.click();
        await (this.page.waitForLoadState('load'))

        await (this.page.waitForLoadState('networkidle'))
        return new pindrioLoginPage(this.page)
    }
}