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

// Scenario: Validate user login process
// Given:
// The user is on the home page and wants to login
// When:
// The user goes to the login page
// And inputs the login information
// And presses the login button
// Then:
// They are successfully logged in, by seeing their name instead of the default login button
test("Test Login", async ({ page }) => {
  test.setTimeout(180_000);

  const homePage = new pindrioHomePage(page);

  const loginPage = await homePage.goToLogIn();

  await loginPage.login(ctx);

  await expect(homePage.loggedInButton).toBeVisible();
});

// Scenario: The user doesn't have an account and wants to sign up on the home page
// Given:
// The user is on the home page and wants so sign up.
// When:
// The user goes to the sign up page
// And Fills in the info
// And presses the continue button
// And logs into their email
// And clicks on the newly sent email from the platform
// Optional And clicks the 3 dots
// And presses the verify button which opens a new tab
// Then:
// The user is on a newly opened tab which says activation successful
test("Test Sign Up", async ({ page, browser }) => {
  test.setTimeout(180_000);

  const signUpPage = new pindrioSignUpPage(page);

  await signUpPage.signUp(ctxUnique);

  await activateAccount(browser);
});

// Scenario: The user wants to update their profile
// Given:
// The user is on the main page and wants to update their profile
// When:
// The user logs in their account
// And the user goes to their profile page by clicking the account button in the navbar
// And goes to their profile tab
// And fills in the values he wants to change
// And presses save
// And reloads the page so the changes take effect
// And changes back the values
// And clicks save again
// And reloads the page
// Then:
// The values the changed are saved and displayed correctly.
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
