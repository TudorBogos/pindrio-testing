import { test, expect, Browser, chromium } from "@playwright/test";
import { exec } from "child_process";
import { log } from "console";
import { pindrioActivationAccPage } from "../pages/pindrioActivationAccPage";

export async function activateAccount(browser: Browser) {
  try {
    const context = await browser.newContext();

    const page = await context.newPage();

    const login_fill = page.getByRole("textbox", {
      name: "Email or phone",
    });
    const next_button = page.getByRole("button", { name: "Next" });
    const password_fill = page.getByRole("textbox", {
      name: "Enter your password",
    });
    const email_row = page.getByRole("row", {
      name: /unread,\s+contact(\s+\d*)*,\s+Activare/,
    });
    const activationSuccessful = page.getByText("Activation successful");
    const dots = page.getByRole("button", { name: "Show trimmed content" });
    const verifica = page.getByRole("link", { name: "Verifică" });

    await page.goto("https://mail.google.com/mail");

    await expect(login_fill).toBeVisible();
    await login_fill.fill("tudorandreimunca@gmail.com");

    await expect(next_button).toBeVisible();
    await next_button.click();

    await expect(password_fill).toBeVisible();
    await password_fill.fill("Tudor,andrei2025");

    await expect(next_button).toBeVisible();
    await next_button.click();

    await page.waitForLoadState("load");

    await page.waitForTimeout(7000);

    await expect(email_row).toBeVisible();
    await email_row.click();

    //Dots are visible if there's an ongoing conversation in GMAIL
    try {
      await expect(dots).toBeVisible();
      await dots.click();
    } catch (error) {
      console.log("Dots element is not visible or does not exist.");
    }

    await expect(verifica).toBeVisible();
    await verifica.click();

    await page.waitForLoadState("load");

    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      await verifica.click(),
    ]);

    const activPage = new pindrioActivationAccPage(newPage);

    await expect(activPage.activSucc).toBeVisible();
  } catch (error) {
    console.error("An error occurred during the sign-up process:", error);
  }
}
