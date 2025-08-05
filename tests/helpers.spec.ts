import {expect, Page} from "@playwright/test";

type TestContext = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
};

let cachedTestCtx: TestContext | null = null;

export function testContext(): TestContext {
    if (!cachedTestCtx) {
/*        const rand:  number = Math.floor(Math.random() * (1000  + 1));*/
        cachedTestCtx = {
            firstName: `Andrei`,
            lastName: `Munteanu`,
            email: `andreimunteanu7@yahoo.com`,
            password: `%Test123`,
            phone: '0728563846'
        };
    }
    return cachedTestCtx;
}

export const createTestContext = () => {
/*    const rand:  number = Math.floor(Math.random() * (1000  + 1));*/
    return {
        firstName: `Andrei`,
        lastName: `Munteanu`,
        email: `andreimunteanu7@yahoo.com`,
        password: `%Test123`,
        phone: '0728563846'
    };
};

export async function signUp(page: Page, ctx: TestContext) {
    try {
        await page.goto('https://ioto-marketplace.semiotic.eu/');

        const acceptButton = page.getByRole('button', { name: 'Accept' });
        if (await acceptButton.isVisible()) {
            await acceptButton.click();
        }

        await page.getByRole('button', { name: 'Log in/Join IoTo club' }).click();

        await page.getByRole('button', { name: 'Join IoTo club', exact: true }).click();

        const emailTextbox = page.locator('#main').getByRole('textbox', { name: 'Email' });
        await emailTextbox.waitFor({ state: 'visible' });
        await emailTextbox.click();
        await emailTextbox.fill(ctx.email);

        const firstNameTextbox = page.getByRole('textbox', { name: 'First Name' });
        await firstNameTextbox.click();
        await firstNameTextbox.fill(ctx.firstName);

        const lastNameTextbox = page.getByRole('textbox', { name: 'Last Name' });
        await lastNameTextbox.click();
        await lastNameTextbox.fill(ctx.lastName);

        const phoneTextbox = page.getByRole('textbox', { name: 'Phone' });
        await phoneTextbox.click();
        await phoneTextbox.fill(ctx.phone);

        const passwordTextbox = page.getByRole('textbox', { name: 'Password', exact: true });
        await passwordTextbox.click();
        await passwordTextbox.fill(ctx.password);

        const confirmPasswordTextbox = page.getByRole('textbox', { name: 'Confirm password' });
        await confirmPasswordTextbox.waitFor({ state: 'visible' });
        await confirmPasswordTextbox.click({ force: true });
        await confirmPasswordTextbox.fill(ctx.password);

        await page.getByRole('checkbox').nth(1).click();
        await page.getByRole('button', { name: 'Create account' }).click();

    } catch (error) {
        console.error('An error occurred during the sign-up process:', error);
    }
}



export async function logIn(page: Page, ctx: TestContext) {
    try {
        await page.goto('https://ioto-marketplace.semiotic.eu/');

        await page.waitForLoadState('networkidle');

        const acceptButton = page.getByRole('button', { name: 'Accept' });
        if (await acceptButton.isVisible()) {
            await acceptButton.click();
        }

        await page.getByRole('button', { name: 'Log in/Join IoTo club' }).click();

        await page.getByRole('button', { name: 'Log in', exact: true }).click();

        const emailTextbox = page.locator('#main').getByRole('textbox', { name: 'Email' });
        await emailTextbox.waitFor({ state: 'visible', timeout: 10000 });
        await emailTextbox.click();
        await emailTextbox.fill(ctx.email);

        const passwordTextbox = page.getByRole('textbox', { name: 'Password' });
        await passwordTextbox.click();
        await passwordTextbox.fill(ctx.password);

        await page.getByRole('button', { name: 'Log in', exact: true }).click();

        await expect(page.getByRole('link', { name: 'Account Overview' })).toBeVisible({ timeout: 10000 });

    } catch (error) {
        console.error('An error occurred during the login process:', error);
        throw error;
    }
}


export async function logOut (page: Page, ctx:TestContext) {
    await page.goto('https://ioto-marketplace.semiotic.eu/');
    await page.getByRole('button', { name: 'Hello! Andrei Munteanu' }).click();
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('button', { name: 'Log in/Join IoTo club' })).toBeVisible();

}