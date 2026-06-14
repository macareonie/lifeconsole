import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("login and logout flow", async ({ page }) => {
    await page.getByRole("link", { name: "Login" }).click();
    await expect(page.getByText("Sign in to access features")).toBeVisible();
    await page.getByPlaceholder("Enter your username").click();
    await page.getByPlaceholder("Enter your username").fill("Hello");
    await page.getByPlaceholder("Enter your password").click();
    await page.getByPlaceholder("Enter your password").fill("qazwsxedc");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  });
});
