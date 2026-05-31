import { test, expect } from "@playwright/test";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("login and view boards flow", async ({ page }) => {
    await page.getByRole("link", { name: "Get Started" }).click();
    await page.getByPlaceholder("Enter your username").click();
    await page.getByPlaceholder("Enter your username").fill("Hello");
    await page.getByPlaceholder("Enter your username").press("Tab");
    await page.getByPlaceholder("Enter your password").fill("qazwsxedc");
    await page.getByRole("button", { name: "Log in" }).click();
    await page.getByRole("link", { name: "Get Started" }).click();
    await expect(
      page.getByRole("heading", { name: "Your Boards" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "To Do List" }).click();
    await expect(
      page.locator("div").filter({ hasText: "To Do List2 columnsEdit" }).nth(3),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Wake up before 12pm please" })
      .click();
    await expect(
      page.getByText(
        "Wake upCloseTitleSubtitleMetadata JSONSave cardCancelCurrent metadataDelete card",
      ),
    ).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(
      page.getByRole("button", { name: "Wake up before 12pm please" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  });
});
