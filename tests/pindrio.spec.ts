import { test, expect } from '@playwright/test';
import {
  createTestContext,
  testContext,
  addOneItemToCart, goToWishlistPage,
} from './helpers.spec'
import {pindrioHomePage} from "../pages/pindrioHomePage";
import {pindrioSignUpPage} from "../pages/pindrioSignUp";
import {pindrioProfilePage} from "../pages/pindrioProfile";
import {pindrioCart} from "../pages/pindrioCart";
import {log} from "console";
import {pindrioProductsListPage} from "../pages/pindrioProductsListPage";
import * as Console from "node:console";

const ctx = testContext();

test('Test Login', async ({ page }) => {
  test.setTimeout(180_000);

  const homePage = new pindrioHomePage(page);

  const loginPage = await homePage.goToLogIn();

  await loginPage.login(ctx);

  await expect(homePage.loggedInButton).toBeVisible();


});

test('Test Sign Up', async ({ page }) => {
  test.setTimeout(180_000);

  const signUpPage = new pindrioSignUpPage(page);


  await signUpPage.signUp(ctx);


  await expect(page.getByText('This email address is already')).toBeVisible();
});

test('Edit Profile', async ({ page }) => {
  test.setTimeout(180_000);


  const homePage = new pindrioHomePage(page);
  const loginPage = await homePage.goToLogIn();


  await loginPage.login(ctx);

  const profilePage = new pindrioProfilePage(loginPage.page);

  await profilePage.editProfileRevert(ctx);

});

test ('Checkout', async ({ page }) => {

  test.setTimeout(180_000);

  const homePage = new pindrioHomePage(page);
  const loginPage = await homePage.goToLogIn();

  await loginPage.login(ctx);

  const cartPage = new pindrioCart(loginPage.page);

  await cartPage.removeEverythingFromCart();

  await addOneItemToCart(page, ctx);

  const checkoutPage=await cartPage.performCheckout();
  await checkoutPage.fillInfo(ctx);
  const paymentPage=await checkoutPage.proceedCheckout()

  const orderConfirmed=await paymentPage.fillCardInfo(ctx);

  await orderConfirmed.verifyItem('Wireless Game Joystick Controller Left and Right Handle for Nintendo Switch Pro', 1);



})

test ('Add to wishlist', async ({ page }) => {

  test.setTimeout(180_000);

  const homePage = new pindrioHomePage(page);
  const loginPage = await homePage.goToLogIn();

  await loginPage.login(ctx);

  const btnAllProducts = page.getByRole('button', { name: 'open menu' });
  await expect(btnAllProducts).toBeVisible();
  await page.hover("//button[@aria-label='open menu' and @class='flex items-center justify-center py-2 px-4']");

  const btnElectronice = page.getByRole('button', { name: 'Electronice', exact: true });
  await expect(btnElectronice).toBeVisible();
  await btnElectronice.click();

  const btnSeeAllProducts = page.getByRole('button', { name: 'See all products' }).nth(0);
  await expect(btnSeeAllProducts).toBeVisible();
  await btnSeeAllProducts.click({force: true});

  const productsList = new pindrioProductsListPage(loginPage.page);

  await productsList.page.waitForLoadState('networkidle')
  await productsList.page.waitForLoadState('domcontentloaded')

  let indexToCheck=13;


  await productsList.wishlistIcons.nth(indexToCheck).click();
  //await productsList.addToCartButtons.nth(14).click();
  //addToCart index este decalat cu 1

  let string = productsList.itemsNames.nth(indexToCheck);


  await productsList.page.waitForLoadState('networkidle')
  await productsList.page.waitForLoadState('domcontentloaded')

  const wishlistPage=await goToWishlistPage(productsList.page);

  await wishlistPage.page.waitForLoadState('networkidle')
  await wishlistPage.page.waitForLoadState('domcontentloaded')

  /*await productsList.page.waitForTimeout(15000);*/

})

