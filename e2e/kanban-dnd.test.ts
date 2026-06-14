import { expect, test } from "@playwright/test";

test.describe("Board", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("login, create board with columns and cards, drag to reorder, delete board", async ({
    page,
  }, testInfo) => {
    const unique = `${testInfo.project.name}-${Date.now()}`;
    const boardTitle = `e2e testboard ${unique}`;
    const columnTitle = `test column ${unique}`;
    const cardTitle = `test card ${unique}`;
    const cardSubtitle = `context ${unique}`;

    const columnAName = `${columnTitle}a`;
    const columnBName = `${columnTitle}b`;
    const columnCName = `${columnTitle}c`;
    const cardATitle = `${cardTitle}a`;
    const cardBTitle = `${cardTitle}b`;
    const cardCTitle = `${cardTitle}c`;

    // ── Login ──────────────────────────────────────────────────────────────
    await page.getByRole("link", { name: "Get Started" }).click();
    await page.getByPlaceholder("Enter your username").fill("Hello");
    await page.getByPlaceholder("Enter your password").fill("qazwsxedc");
    await page.getByRole("button", { name: "Log in" }).click();

    // ── Navigate to boards ─────────────────────────────────────────────────
    await page.getByRole("link", { name: "Get Started" }).click();
    await expect(
      page.getByRole("heading", { name: "Your Boards" }),
    ).toBeVisible();

    // ── Create board ───────────────────────────────────────────────────────
    await page.getByRole("textbox", { name: "Board title" }).fill(boardTitle);
    await page.getByRole("button", { name: "Create board" }).click();
    const boardLink = page.getByRole("link", { name: boardTitle });
    await expect(boardLink).toBeVisible();
    await boardLink.click();

    // ── Create columns ─────────────────────────────────────────────────────
    for (const name of [columnAName, columnBName, columnCName]) {
      await page.getByRole("button", { name: "Add column" }).click();
      await page.getByRole("textbox", { name: "Column title" }).fill(name);
      await page.getByRole("button", { name: "Create column" }).click();
      await expect(
        page.getByRole("region", { name: `Column: ${name}` }),
      ).toBeVisible();
    }

    const colA = page.getByRole("region", { name: `Column: ${columnAName}` });
    const colB = page.getByRole("region", { name: `Column: ${columnBName}` });
    const colC = page.getByRole("region", { name: `Column: ${columnCName}` });

    // ── Create cards ───────────────────────────────────────────────────────
    const createCard = async (
      col: ReturnType<typeof page.getByRole>,
      colName: string,
      title: string,
      subtitle: string,
    ) => {
      await col.getByRole("button", { name: "Add card" }).click();
      const form = page.getByRole("form", {
        name: `Create card in column ${colName}`,
      });
      await form.getByRole("textbox", { name: "Card title" }).fill(title);
      await form.getByRole("textbox", { name: "Subtitle" }).fill(subtitle);
      await form.getByRole("button", { name: "Create card" }).click();
      await expect(col.getByText(title, { exact: true })).toBeVisible();
    };

    await createCard(colA, columnAName, cardATitle, `${cardSubtitle}a`);
    await createCard(colB, columnBName, cardBTitle, `${cardSubtitle}b`);
    await createCard(colC, columnCName, cardCTitle, `${cardSubtitle}c`);

    // check card counts A:1, B:1, C:1
    await expect(colA.getByText("1", { exact: true })).toBeVisible();
    await expect(colB.getByText("1", { exact: true })).toBeVisible();
    await expect(colC.getByText("1", { exact: true })).toBeVisible();

    // ── Helpers ────────────────────────────────────────────────────────────
    const cardHandle = (title: string) =>
      page.getByRole("button", { name: `Drag card: ${title}` });

    const columnHandle = (name: string) =>
      page
        .getByRole("region", { name: `Column: ${name}` })
        .getByRole("button", { name: `Drag column: ${name}` });

    const drag = async (
      handle: ReturnType<typeof page.getByRole>,
      ...keys: string[]
    ) => {
      await handle.press("Space");
      await page.waitForTimeout(150);
      for (const key of keys) {
        await handle.press(key);
        await page.waitForTimeout(150);
      }
      await handle.press("Space");
      await page.waitForTimeout(300); // allow layout mutation to fire
    };

    // ── Drag card A → column B ─────────────────────────────────────────────
    await drag(cardHandle(cardATitle), "ArrowRight");
    await expect(
      colA.getByRole("article", { name: `Card: ${cardATitle}` }),
    ).not.toBeVisible();
    await expect(
      colB.getByRole("article", { name: `Card: ${cardATitle}` }),
    ).toBeVisible();

    // ── Drag card C → column B ─────────────────────────────────────────────
    await drag(cardHandle(cardCTitle), "ArrowLeft");
    await expect(
      colC.getByRole("article", { name: `Card: ${cardCTitle}` }),
    ).not.toBeVisible();
    await expect(
      colB.getByRole("article", { name: `Card: ${cardCTitle}` }),
    ).toBeVisible();

    // ── Drag column A → position 2 (after column B) ────────────────────────
    await drag(columnHandle(columnAName), "ArrowRight");

    // check card counts B:3, A:0, C:0
    await expect(colA.getByText("0", { exact: true })).toBeVisible();
    await expect(colB.getByText("3", { exact: true })).toBeVisible();
    await expect(colC.getByText("0", { exact: true })).toBeVisible();

    // ── Cleanup ────────────────────────────────────────────────────────────
    await page.getByRole("button", { name: "Delete board" }).click();
    await page.getByRole("button", { name: "Delete board" }).click();

    await page.goto("/board");
    await expect(
      page.getByRole("heading", { name: "Your Boards" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: boardTitle }),
    ).not.toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
  });
});
