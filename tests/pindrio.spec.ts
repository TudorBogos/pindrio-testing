import { test, expect } from '@playwright/test';
import {logIn, logOut, signUp, createTestContext, testContext} from './helpers.spec'
import {sign} from "node:crypto";

const ctx = testContext();

test('Test Login', async ({ page }) => {
  await logIn(page,ctx);
  await logOut(page,ctx);

});

test('Test Sign Up', async ({ page }) => {
  await signUp(page,ctx);
  await page.waitForTimeout(10000);
});
