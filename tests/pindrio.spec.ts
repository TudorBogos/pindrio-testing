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
import { pindrioWishlistPage } from "../pages/pindrioWishlistPage";
import { pindrioProductsListPage } from "../pages/pindrioProductsListPage";

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
test.describe("User Flows", async () => {
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
  // And fills in the sign up info
  // And clicks the continue button
  // And logs into their email
  // And clicks on the newly sent email from the platform
  // Optional And clicks the 3 dots
  // And clicks the verify button which opens a new tab
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
  // And clicks save
  // And reloads the page so the changes take effect
  // And changes back the values
  // And clicks save again
  // And reloads the page
  // Then:
  // The values that have been changed are saved and displayed correctly.
  test("Edit Profile", async ({ page }) => {
    test.setTimeout(180_000);

    const homePage = new pindrioHomePage(page);
    const loginPage = await homePage.goToLogIn();

    await loginPage.login(ctx);

    const profilePage = new pindrioProfilePage(loginPage.page);

    await profilePage.editProfileRevert(ctx);
  });

  // Scenario: The user wants to add an item to the cart and checkout
  // Given:
  // The user is logged in and wants to add an item to the cart
  // When:
  // The user goes to the home page
  // And clicks on the "All Products" button
  // And clicks on the "Electronice" tab
  // And clicks on the "See all products" button
  // And clicks on the "Add to cart" button for the first product
  // And clicks on the "Go to Cart" button
  // And clicks on the "Proceed to Checkout" button
  // And fills in the checkout information
  // And clicks on the "Proceed to Payment" button
  // And fills in the payment information
  // And clicks on the "Pay" button
  // Then:
  // The user is redirected to the order confirmation page and sees the item in the order details
  test("Checkout", async ({ page }) => {
    test.setTimeout(180_000);

    const homePage = new pindrioHomePage(page);
    const loginPage = await homePage.goToLogIn();

    await loginPage.login(ctx);

    const cartPage = new pindrioCart(loginPage.page);

    await cartPage.removeEverythingFromCart();

    await addOneItemToCart(page, ctx);

    const checkoutPage = await cartPage.performCheckout();
    await checkoutPage.fillInfo(ctx);
    const paymentPage = await checkoutPage.proceedCheckout();

    const orderConfirmed = await paymentPage.fillCardInfo(ctx);

    await orderConfirmed.verifyItem(
      "Wireless Game Joystick Controller Left and Right Handle for Nintendo Switch Pro",
      1
    );
  });

  // Scenario: The user wants to add an item to the wishlist
  // Given:
  // The user is logged in and wants to add an item to the wishlist
  // When:
  // The user goes to the home page
  // And clicks on the "All Products" button
  // And clicks on the "Electronice" tab
  // And clicks on the "See all products" button
  // And clicks on the "Add to wishlist" button for the first product
  // And clicks on the "View Wish List" button
  // Then:
  // The user is redirected to the wishlist page and sees the item in the wishlist
  test("Add to wishlist", async ({ page }) => {
    test.setTimeout(180000);
    const homePage = new pindrioHomePage(page);
    const loginPage = await homePage.goToLogIn();
    await loginPage.login(ctx);
    await loginPage.page.waitForLoadState("load");

    const wishlistPage = new pindrioWishlistPage(page);
    await wishlistPage.removeEverythingFromWishlist();

    const btnAllProducts = wishlistPage.page.getByRole("button", {
      name: "open menu",
    });
    await expect(btnAllProducts).toBeVisible();
    await wishlistPage.page.hover(
      "//button[@aria-label='open menu' and @class='flex items-center justify-center py-2 px-4']"
    );

    const btnElectronice = wishlistPage.page.getByRole("button", {
      name: "Electronice",
      exact: true,
    });
    await expect(btnElectronice).toBeVisible();
    await btnElectronice.click();

    const btnSeeAllProducts = wishlistPage.page
      .getByRole("button", { name: "See all products" })
      .first();
    await expect(btnSeeAllProducts).toBeVisible();
    await btnSeeAllProducts.click({ force: true });

    const productsList = new pindrioProductsListPage(wishlistPage.page);
    await productsList.page.waitForLoadState("load");

    const indexToCheck = 13;
    await productsList.wishlistIcons.nth(indexToCheck).click();
    await productsList.page.waitForTimeout(3000);
    const nameToCheck = await productsList.itemsNames
      .nth(indexToCheck)
      .textContent();

    await productsList.page
      .locator(
        ".small\\:flex.gap-1.p-2.text-sm.font-medium.hover\\:opacity-1\\/2"
      )
      .filter({ hasText: "Wishlist" })
      .click();
    await productsList.page.waitForLoadState("load");

    await productsList.page
      .getByRole("button", { name: "View Wish List" })
      .click();
    await productsList.page.waitForLoadState("load");
    await productsList.page.waitForTimeout(5000);

    const wishlistPage2 = new pindrioWishlistPage(productsList.page);
    await wishlistPage2.page.waitForLoadState("load");

    const noOfItemsInWishlist = await wishlistPage2.noOfItemsInWishlist;
    console.log(noOfItemsInWishlist);
    expect(noOfItemsInWishlist).toStrictEqual(1);

    const wishlistItems = await wishlistPage2.itemsList;
    console.log("Wishlist items", wishlistItems);
    const firstWishlistItemName = await wishlistItems[0].textContent();

    expect(nameToCheck).toBe(firstWishlistItemName);

    await wishlistPage2.page.waitForLoadState("load");
    await wishlistPage2.removeEverythingFromWishlist();
  });
});
