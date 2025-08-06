import { test, expect } from '@playwright/test';
import {
  logIn,
  logOut,
  signUp,
  createTestContext,
  testContext,
  editProfileRevert,
  removeEverythingFromCart, checkout
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

  await checkout(page, ctx);

})
