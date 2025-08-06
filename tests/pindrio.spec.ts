import { test, expect } from '@playwright/test';
import {
  logIn,
  logOut,
  signUp,
  createTestContext,
  testContext,
  editProfileRevert,
  removeEverythingFromCart
} from './helpers.spec'
import {sign} from "node:crypto";

const ctx = testContext();

test('Test Login', async ({ page }) => {
  test.setTimeout(180_000);

  await logIn(page,ctx);
  await logOut(page,ctx);

});

test('Test Sign Up', async ({ page }) => {
  test.setTimeout(180_000);

  await signUp(page,ctx);
  await expect(page.getByText('This email address is already')).toBeVisible();
});

test('Edit Profile', async ({ page }) => {
  test.setTimeout(180_000);

  await logIn(page,ctx);
  await editProfileRevert(page,ctx);

});

test ('Checkout', async ({ page }) => {

  test.setTimeout(180_000);

  await logIn(page,ctx);

  await removeEverythingFromCart(page,ctx);

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


  await expect(page.getByText('Product Summary')).toBeVisible();
})