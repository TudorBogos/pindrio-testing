import { test, expect } from '@playwright/test';
import {
  createTestContext,
  testContext,
  addOneItemToCart,
} from './helpers.spec'
import {pindrioHomePage} from "../pages/pindrioHomePage";
import {pindrioSignUpPage} from "../pages/pindrioSignUp";
import {pindrioProfilePage} from "../pages/pindrioProfile";
import {pindrioCart} from "../pages/pindrioCart";
import {log} from "console";
import {pindrioProductsListPage} from "../pages/pindrioProductsListPage";
import * as Console from "node:console";
import {pindrioWishlistPage} from "../pages/pindrioWishlistPage";

const ctx = testContext();

test.describe("User Flows", async () => {

  test('Test Login', async ({page}) => {
    test.setTimeout(180_000);

    const homePage = new pindrioHomePage(page);

    const loginPage = await homePage.goToLogIn();

    await loginPage.login(ctx);

    await expect(homePage.loggedInButton).toBeVisible();


  });

  test('Test Sign Up', async ({page}) => {
    test.setTimeout(180_000);

    const signUpPage = new pindrioSignUpPage(page);


    await signUpPage.signUp(ctx);


    await expect(page.getByText('This email address is already')).toBeVisible();
  });

  test('Edit Profile', async ({page}) => {
    test.setTimeout(180_000);


    const homePage = new pindrioHomePage(page);
    const loginPage = await homePage.goToLogIn();


    await loginPage.login(ctx);

    const profilePage = new pindrioProfilePage(loginPage.page);

    await profilePage.editProfileRevert(ctx);

  });

  test('Checkout', async ({page}) => {

    test.setTimeout(180_000);

    const homePage = new pindrioHomePage(page);
    const loginPage = await homePage.goToLogIn();

    await loginPage.login(ctx);

    const cartPage = new pindrioCart(loginPage.page);

    await cartPage.removeEverythingFromCart();

    await addOneItemToCart(page, ctx);

    const checkoutPage = await cartPage.performCheckout();
    await checkoutPage.fillInfo(ctx);
    const paymentPage = await checkoutPage.proceedCheckout()

    const orderConfirmed = await paymentPage.fillCardInfo(ctx);

    await orderConfirmed.verifyItem('Wireless Game Joystick Controller Left and Right Handle for Nintendo Switch Pro', 1);


  })

  test('Add to wishlist', async ({ page }) => {
    test.setTimeout(180000);
    const homePage = new pindrioHomePage(page);
    const loginPage = await homePage.goToLogIn();
    await loginPage.login(ctx);
    await loginPage.page.waitForLoadState('load');

    const wishlistPage = new pindrioWishlistPage(page);
    await wishlistPage.removeEverythingFromWishlist();

    const btnAllProducts = wishlistPage.page.getByRole('button', { name: 'open menu' });
    await expect(btnAllProducts).toBeVisible();
    await wishlistPage.page.hover("//button[@aria-label='open menu' and @class='flex items-center justify-center py-2 px-4']");

    const btnElectronice = wishlistPage.page.getByRole('button', { name: 'Electronice', exact: true });
    await expect(btnElectronice).toBeVisible();
    await btnElectronice.click();

    const btnSeeAllProducts = wishlistPage.page.getByRole('button', { name: 'See all products' }).first();
    await expect(btnSeeAllProducts).toBeVisible();
    await btnSeeAllProducts.click({ force: true });

    const productsList = new pindrioProductsListPage(wishlistPage.page);
    await productsList.page.waitForLoadState('load');

    const indexToCheck = 13;
    await productsList.wishlistIcons.nth(indexToCheck).click();
    await productsList.page.waitForTimeout(3000);
    const nameToCheck = await productsList.itemsNames.nth(indexToCheck).textContent();

    await productsList.page.locator('.small\\:flex.gap-1.p-2.text-sm.font-medium.hover\\:opacity-1\\/2').filter({ hasText: 'Wishlist' }).click();
    await productsList.page.waitForLoadState('load');

    await productsList.page.getByRole('button', { name: 'View Wish List' }).click();
    await productsList.page.waitForLoadState('load');
    await productsList.page.waitForLoadState('networkidle');
    await productsList.page.waitForTimeout(5000);

    const wishlistPage2 = new pindrioWishlistPage(productsList.page);
    await wishlistPage2.page.waitForLoadState('load');

    const noOfItemsInWishlist = await wishlistPage2.noOfItemsInWishlist;
    console.log(noOfItemsInWishlist);
    expect(noOfItemsInWishlist).toStrictEqual(1);

    const wishlistItems = await wishlistPage2.itemsList;
    console.log('Wishlist items', wishlistItems);
    const firstWishlistItemName = await wishlistItems[0].textContent();

    expect(nameToCheck).toBe(firstWishlistItemName);

    await wishlistPage2.page.waitForLoadState('load');
    await wishlistPage2.removeEverythingFromWishlist();


  });
});

