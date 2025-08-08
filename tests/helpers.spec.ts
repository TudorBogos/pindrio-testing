import {expect, Page} from "@playwright/test";
import {pindrioWishlistPage} from "../pages/pindrioWishlistPage";

export type TestContext = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    alias: string;
    apartmentSuite:string;
    city:string;
    country: string;
    county:string;
    postalCode: string;
    shippingAddress: string;
    cardNo: string;
    cardCVC:string;
    cardName:string;
    cardDate:string;
};

let cachedTestCtx: TestContext | null = null;

export function testContext(): TestContext {
    if (!cachedTestCtx) {
        cachedTestCtx = {
            alias: 'AndreiM',
            apartmentSuite: '12',
            city: 'Galati',
            country: 'Romania',
            county: 'Galati',
            email: `andreimunteanu7@yahoo.com`,
            firstName: `Andrei`,
            lastName: `Munteanu`,
            password: `%Test123`,
            phone: '0728563846',
            postalCode: '937022',
            shippingAddress: 'Strada Traian',
            cardNo: '9900004810225098',
            cardCVC:'111',
            cardName:'Test Test',
            cardDate:'12/31'
        };
    }
    return cachedTestCtx;
}

export const createTestContext = () => {
    return {
        aliasN: 'AndreiM',
        apartmentSuite: '12',
        city: 'Galati',
        country: 'Romania',
        county: 'Galati',
        email: `andreimunteanu7@yahoo.com`,
        firstName: `Andrei`,
        lastName: `Munteanu`,
        password: `%Test123`,
        phone: '0728563846',
        postalCode: '937022',
        shippingAddress: 'Strada Traian',
        cardNo: '9900004810225098',
        cardCVC:'111',
        cardName:'Test Test',
        cardDate:'12/31'
    };
};

export async function acceptCookies(page: Page) {
    const acceptButton = page.getByRole('button', { name: 'Accept' });
    if (await acceptButton.isVisible()) {
        await acceptButton.click();
    }
}

export async function addOneItemToCart(page: Page, ctx: TestContext) {
    const btnAllProducts = page.getByRole('button', { name: 'open menu' });
    await expect(btnAllProducts).toBeVisible();
    await page.hover("//button[@aria-label='open menu' and @class='flex items-center justify-center py-2 px-4']");

    const btnElectronice = page.getByRole('button', { name: 'Electronice', exact: true });
    await expect(btnElectronice).toBeVisible();
    await btnElectronice.click();

    const btnSeeAllProducts = page.getByRole('button', { name: 'See all products' }).nth(0);
    await expect(btnSeeAllProducts).toBeVisible();
    await btnSeeAllProducts.click();


    const btnAddToCart = page.getByRole('link', { name: 'NT0098_1 wishlist-icon 【' }).getByRole('button').nth(1)
    await expect(btnAddToCart).toBeVisible({ timeout: 10000 });
    await btnAddToCart.click();

/*    const _requestAddToCart = page.waitForResponse(
        (res) =>
            res.request().method() === "GET" &&
            res.status() === 304 &&
            res.url().includes("/proxy/api/v1/store/products/prod_01J8S8J0QJ82FMKFKZ35MXV4W1?cart_id=cart_01K24FPMG43M4TFDH21E7816RE&currency_code=ron&region_id=reg_01HMF3ME1JCP67G8QRK9CNP0PP")
    );*/



    const btnGoToCart = page.getByRole('button', { name: 'Go to Cart' });
    await expect(btnGoToCart).toBeVisible();
    await btnGoToCart.click();



/*    const responseAddToCart = await _requestAddToCart;


    if (!responseAddToCart.ok()) {
        console.error("API Failed when editing profile:", responseAddToCart.status());
    } else {
        const responseData: { product: { title: string } } = await responseAddToCart.json();

        if (responseData.product.title === "【Haweel】 Wireless Game Joystick Controller Left and Right Handle for Nintendo Switch Pro" ) {
            console.log("The response data contains the correct item.");
        } else {
            console.error("The response data does not contain the correct item.");
        }
    }*/







    await page.waitForLoadState('load');
    await expect(page.getByText('Product Summary')).toBeVisible();
    await expect(page.locator('#counter-input').nth(0)).toHaveValue('1');

    const titleFirst = page.locator('//p[contains(@class, "line-clamp-1") and contains(@class, "w-9/12")]').nth(0);
    await expect(titleFirst).toBeVisible();
    await expect(titleFirst).toContainText('Wireless Game Joystick Controller Left and Right Handle for Nintendo Switch Pro');
}


