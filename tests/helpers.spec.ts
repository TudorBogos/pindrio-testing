import { expect, Page } from "@playwright/test";

export type TestContext = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  alias: string;
  apartmentSuite: string;
  city: string;
  country: string;
  county: string;
  postalCode: string;
  shippingAddress: string;
};

export function testContext(): TestContext {
  let cachedTestCtx: TestContext | null = null;
  if (!cachedTestCtx) {
    cachedTestCtx = {
      alias: "AndreiM",
      apartmentSuite: "12",
      city: "Galati",
      country: "Romania",
      county: "Galati",
      email: `andreimunteanu7@yahoo.com`,
      firstName: `Andrei`,
      lastName: `Munteanu`,
      password: `%Test123`,
      phone: "0728563846",
      postalCode: "937022",
      shippingAddress: "Strada Traian",
    };
  }
  return cachedTestCtx;
}

//Functie pentru creare date de logare unice cu un id unic format din yymmddhhmm
export function testContextUnique(): TestContext {
  let cachedTestCtx: TestContext | null = null;
  const now = new Date();

  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const uniqueID = `${year}${month}${day}${hours}${minutes}${seconds}`;

  if (!cachedTestCtx) {
    cachedTestCtx = {
      alias: "Tudor Andrei",
      apartmentSuite: "16",
      city: "Galati",
      country: "Romania",
      county: "Galati",
      email: `tudorandreimunca+${uniqueID}@gmail.com`,
      firstName: `Andrei`,
      lastName: `Tudor`,
      password: `%Test123`,
      phone: "0747222222",
      postalCode: "937022",
      shippingAddress: "Bld. Henri Coanda 5",
    };
  }
  return cachedTestCtx;
}

export async function acceptCookies(page: Page) {
  const acceptButton = page.getByRole("button", { name: "Accept" });
  if (await acceptButton.isVisible()) {
    await acceptButton.click();
  }
}

export async function addOneItemToCart(page: Page, ctx: TestContext) {
  const btnAllProducts = page.getByRole("button", { name: "open menu" });
  await expect(btnAllProducts).toBeVisible();
  await page.hover(
    "//button[@aria-label='open menu' and @class='flex items-center justify-center py-2 px-4']"
  );

  const btnElectronice = page.getByRole("button", {
    name: "Electronice",
    exact: true,
  });
  await expect(btnElectronice).toBeVisible();
  await btnElectronice.click();

  const btnSeeAllProducts = page
    .getByRole("button", { name: "See all products" })
    .nth(0);
  await expect(btnSeeAllProducts).toBeVisible();
  await btnSeeAllProducts.click();

  const btnAddToCart = page
    .getByRole("link", { name: "01Main02.jpg wishlist-icon" })
    .getByRole("button")
    .nth(1);
  await expect(btnAddToCart).toBeVisible({ timeout: 10000 });
  await btnAddToCart.click();

  const btnGoToCart = page.getByRole("button", { name: "Go to Cart" });
  await expect(btnGoToCart).toBeVisible();
  await btnGoToCart.click();

  await page.waitForLoadState("load");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Product Summary")).toBeVisible();
  await expect(page.locator("#counter-input").nth(0)).toHaveValue("1");

  const titleFirst = page
    .locator(
      '//p[contains(@class, "line-clamp-1") and contains(@class, "w-9/12")]'
    )
    .nth(0);
  await expect(titleFirst).toBeVisible();
  await expect(titleFirst).toContainText("Statie de andocare");
}
