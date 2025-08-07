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

  const profilePage = new pindrioProfilePage(page);

  await profilePage.editProfileRevert(ctx);

});

test ('Checkout', async ({ page }) => {

  test.setTimeout(180_000);

  const homePage = new pindrioHomePage(page);
  const loginPage = await homePage.goToLogIn();

  await loginPage.login(ctx);

  const cartPage = new pindrioCart(page);

  await cartPage.removeEverythingFromCart();

  await addOneItemToCart(page, ctx);

  const checkoutPage=await cartPage.performCheckout();
  await checkoutPage.fillInfo(ctx);
  const paymentPage=await checkoutPage.proceedCheckout()

  const orderConfirmed=await paymentPage.fillCardInfo(ctx);

  await orderConfirmed.verifyItem('Wireless Game Joystick Controller Left and Right Handle for Nintendo Switch Pro', 1);



})
