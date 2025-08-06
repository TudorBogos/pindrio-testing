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

export async function acceptCookies(page: Page) {
    const acceptButton = page.getByRole('button', { name: 'Accept' });
    if (await acceptButton.isVisible()) {
        await acceptButton.click();
    }
}

export async function signUp(page: Page, ctx: TestContext) {
    try {
        await page.goto('https://ioto-marketplace.semiotic.eu/');

        await acceptCookies(page);

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


        await acceptCookies(page);

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
    await acceptCookies(page);
    await page.getByRole('button', { name: /Hello! \w+ \w+/ }).click();
    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('button', { name: 'Log in/Join IoTo club' })).toBeVisible();

}

export async function resetName(page:Page, ctx:TestContext){
    await page.goto('https://ioto-marketplace.semiotic.eu/');

    const profileBtn =  page.getByRole('button', { name: /Hello! \w+ \w+/ });

    await profileBtn.click();
    await profileBtn.click();
    await profileBtn.click();

    const accountOverviewBtn = page.getByRole('link', { name: 'Account Overview' });
    await accountOverviewBtn.click();

    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();

    await page.getByRole('link', { name: 'Profile' }).click();

    const nameTextbox = page.locator('input[name="first_name"]');
    await expect(nameTextbox).toBeVisible()
    await nameTextbox.click();
    await nameTextbox.fill('Andrei');

    const lastNameTextbox = page.locator('input[name="last_name"]');
    await expect(lastNameTextbox).toBeVisible()
    await lastNameTextbox.click();
    await lastNameTextbox.fill('Munteanu');

    await page.waitForTimeout(3000)
    const saveButton=page.getByRole('button', { name: 'Save' });
    const cancelButton=page.getByRole('button', { name: 'Cancel' });
    if (!(await saveButton.isVisible())) {
        await cancelButton.isEnabled();
        await cancelButton.click();
    } else {
        await saveButton.isEnabled();
        await saveButton.click();
    }
}

export async function editProfileRevert(page:Page, ctx:TestContext) {
    await acceptCookies(page);
    await resetName(page, ctx);
    await page.goto('https://ioto-marketplace.semiotic.eu/');

    const profileBtn =  page.getByRole('button', { name: /Hello! \w+ \w+/ });

    await profileBtn.click();
    await profileBtn.click();
    await profileBtn.click();

    const accountOverviewBtn = page.getByRole('link', { name: 'Account Overview' });
    await accountOverviewBtn.click();

    await expect(page.getByRole('link', { name: 'Profile' })).toBeVisible();

    await page.getByRole('link', { name: 'Profile' }).click();

    const nameTextbox = page.locator('input[name="first_name"]');
    await expect(nameTextbox).toBeVisible()
    await nameTextbox.click();
    await nameTextbox.fill('TestName');

    const lastNameTextbox = page.locator('input[name="last_name"]');
    await expect(lastNameTextbox).toBeVisible()
    await lastNameTextbox.click();
    await lastNameTextbox.fill('TestLastName');

    await page.waitForTimeout(3000)
    const saveButton=page.getByRole('button', { name: 'Save' });
    await saveButton.waitFor({ state: 'visible' });
    await saveButton.isEnabled();
    await saveButton.click();

    await expect(nameTextbox).toBeVisible()
    await expect(lastNameTextbox).toBeVisible()

    await expect(nameTextbox).toHaveValue('TestName');
    await expect(lastNameTextbox).toHaveValue('TestLastName');


    await lastNameTextbox.isEnabled();
    await expect(lastNameTextbox).toBeVisible()
    await lastNameTextbox.click();
    await lastNameTextbox.fill('Munteanu');

    await nameTextbox.isEnabled();
    await expect(nameTextbox).toBeVisible()
    await nameTextbox.click();
    await nameTextbox.fill('Andrei');

    await page.waitForTimeout(3000)
    await saveButton.waitFor({ state: 'visible' });
    await saveButton.isEnabled();
    await saveButton.click();

    await expect(nameTextbox).toBeVisible()
    await expect(lastNameTextbox).toBeVisible()

    await expect(nameTextbox).toHaveValue('Andrei');
    await expect(lastNameTextbox).toHaveValue('Munteanu');


}

export async function removeEverythingFromCart(page:Page, ctx:TestContext){

    await page.goto('https://ioto-marketplace.semiotic.eu/cart');
    /*await page.waitForSelector('button:has-text("Remove")');*/
    const itemsExist = page.getByText('Product Summary');
    const itemsDontExist=page.getByRole('heading', { name: 'Your shopping bag is empty' })
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')
        if (await itemsExist.isVisible()) {
            console.log('Products exist in the cart.');
            const removeButtons = await page.getByRole('button').filter({ hasText: 'Remove' }).all();
            if (removeButtons.length === 0) {
                console.log('Cart empty');
            } else {
                for (const button of removeButtons) {
                    await button.waitFor({ state: 'visible' });

                    if (await button.isVisible()) {
                        await button.click();
                    }
                }
            }
        }

        else if (await itemsDontExist.isVisible()) {
            console.log('No products in the cart.');
        }

}

export async function checkout(page:Page, ctx:TestContext){
    await logIn(page,ctx);

    await removeEverythingFromCart(page,ctx);

    await page.goto(`https://ioto-marketplace.semiotic.eu/cart`)

    const btnAllProducts = page.getByRole('button', { name: 'open menu' });
    await expect(btnAllProducts).toBeVisible();
    await page.hover("//button[@aria-label='open menu' and @class='flex items-center justify-center py-2 px-4']");

    const btnElectronice =page.getByRole('button', { name: 'Electronice', exact: true });
    await expect(btnElectronice).toBeVisible();
    await btnElectronice.click();
    const btnSeeAllProducts=page.getByRole('button', { name: 'See all products' }).nth(0);
    await expect(btnSeeAllProducts).toBeVisible();
    await btnSeeAllProducts.click();

    const btnAddToCart1=page.getByRole('link', { name: '01Main02.jpg wishlist-icon' }).getByRole('button').nth(1);
    await expect(btnAddToCart1).toBeVisible({ timeout: 10000 });
    await btnAddToCart1.click();

    const btnGoToCart=page.getByRole('button', { name: 'Go to Cart' });
    await expect(btnGoToCart).toBeVisible();
    await btnGoToCart.click();
    await page.waitForLoadState('load')
    await page.waitForLoadState('networkidle')


    await expect(page.getByText('Product Summary')).toBeVisible();

    const titleFirst = page.locator('//p[contains(@class, "line-clamp-1") and contains(@class, "w-9/12")]').nth(0);
    await expect (page.locator('#counter-input').nth(0)).toHaveValue('1');

    await expect (titleFirst).toBeVisible();
    await expect(titleFirst).toContainText('Statie de andocare')
}
