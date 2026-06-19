import { expect, test } from "@playwright/test";

test.describe("Login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("login and view boards flow", async ({ page }, testInfo) => {
    // unique identifiers for the diff envs executed in parallel (live db compromise)
    const unique = `${testInfo.project.name}-${Date.now()}`;
    const boardTitle = `e2e testboard ${unique}`;
    const columnTitle = `test column ${unique}`;
    const cardTitle = `test card ${unique}`;
    const cardSubtitle = `context ${unique}`;
    const fieldName = `type ${unique}`;
    const fieldValue = `e2e ${unique}`;

    // login
    await page.getByRole("link", { name: "Get Started" }).click();
    await page.getByPlaceholder("Enter your username").fill("Hello");
    await page.getByPlaceholder("Enter your password").fill("qazwsxedc");
    await page.getByRole("button", { name: "Log in" }).click();

    // navogate to boards page
    await page.getByRole("link", { name: "Get Started" }).click();
    await expect(
      page.getByRole("heading", { name: "Your Boards" }),
    ).toBeVisible();

    // create and enter board
    await page.getByRole("textbox", { name: "Board title" }).fill(boardTitle);
    await page.getByRole("button", { name: "Create board" }).click();

    const boardLink = page.getByRole("link", { name: boardTitle });
    await expect(boardLink).toBeVisible();
    await boardLink.click();

    await expect(
      page.getByRole("button", { name: "Delete board" }),
    ).toBeVisible();

    // add column card and metadata field
    await page.getByRole("button", { name: "Add column" }).click();
    await page.getByRole("textbox", { name: "Column title" }).fill(columnTitle);
    await page.getByRole("button", { name: "Create column" }).click();

    await page.getByRole("button", { name: "Add card" }).click();
    await page.getByRole("textbox", { name: "Card title" }).fill(cardTitle);
    await page.getByRole("textbox", { name: "Subtitle" }).fill(cardSubtitle);

    await page.getByRole("button", { name: "+ Add Row" }).click();
    await page.getByLabel("Field name").first().fill(fieldName);
    await page.getByLabel("Field value").first().fill(fieldValue);

    await page.getByRole("button", { name: "Create card" }).click();

    await expect(page.getByRole("heading", { name: cardTitle })).toBeVisible();

    // clean up - delete board
    await page.getByRole("button", { name: "Delete board" }).click();
    await page.getByRole("button", { name: "Delete board" }).click();

    await page.goto("/board");
    await expect(
      page.getByRole("heading", { name: "Your Boards" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  });
});
