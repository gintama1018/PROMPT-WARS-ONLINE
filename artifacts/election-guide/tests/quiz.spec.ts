import { test, expect } from "@playwright/test";

test("quiz page loads and shows first question", async ({ page }) => {
  await page.goto("/quiz");

  await expect(page.getByRole("heading", { name: "Election Knowledge Check" })).toBeVisible();
  await expect(page.getByText("Question 1 of 8")).toBeVisible();
});
