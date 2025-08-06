import { test, expect, type Page } from "@playwright/test";
import { exec } from "child_process";
import { log } from "console";

export async function activateAccount(page: Page) {
  try {
    const login_fill = page.getByRole("textbox", {
      name: "Email or phone",
    });
    const next_button = page.getByRole("button", { name: "Next" });
    const password_fill = page.getByRole("textbox", {
      name: "Enter your password",
    });
    const email_row = page.getByRole("link", {
      name: "Activare Cont Client  -",
    });
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

    await expect(email_row).toBeVisible();
    await email_row.click();

    await expect(dots).toBeVisible();
    await dots.click();

    await expect(verifica).toBeVisible();
    await verifica.click();
  } catch (error) {
    console.error("An error occurred during the sign-up process:", error);
  }
}
