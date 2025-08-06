import { test, expect } from "@playwright/test";
import {
  testContext,
  addOneItemToCart,
  testContextUnique,
} from "./helpers.spec";
import { pindrioHomePage } from "../pages/pindrioHomePage";
import { pindrioSignUpPage } from "../pages/pindrioSignUp";
import { pindrioProfilePage } from "../pages/pindrioProfile";
import { pindrioCart } from "../pages/pindrioCart";
import { activateAccount } from "./email.spec";

const ctx = testContext();
const ctxUnique = testContextUnique();

test("Test Sign Up", async ({ page }) => {
  test.setTimeout(180_000);

  const signUpPage = new pindrioSignUpPage(page);

  await signUpPage.signUp(ctxUnique);

  await activateAccount(page);

  await expect(page.getByText("Activation successful")).toBeVisible();
});

test("Test Login with safe account", async ({ page }) => {
  test.setTimeout(180_000);

  const homePage = new pindrioHomePage(page);

  const loginPage = await homePage.goToLogIn();

  await loginPage.login(ctx);

  await expect(homePage.loggedInButton).toBeVisible();
});

test("Edit Profile", async ({ page }) => {
  test.setTimeout(180_000);

  const homePage = new pindrioHomePage(page);
  const loginPage = await homePage.goToLogIn();

  await loginPage.login(ctx);

  const profilePage = new pindrioProfilePage(page);

  await profilePage.editProfileRevert(ctx);
});

test("Checkout", async ({ page }) => {
  test.setTimeout(180_000);

  const homePage = new pindrioHomePage(page);
  const loginPage = await homePage.goToLogIn();

  await loginPage.login(ctx);

  const cartPage = new pindrioCart(page);

  await cartPage.removeEverythingFromCart();

  await addOneItemToCart(page, ctx);

  const checkoutPage = await cartPage.performCheckout();
  await checkoutPage.fillInfo(ctx);
});
