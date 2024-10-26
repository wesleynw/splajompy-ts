import { test, expect } from "@playwright/test";
import { createClient } from "@vercel/postgres";

test("create a post", async ({ page }) => {
  // TODO: paramaterize account creation
  // delete test user from previous runs
  const client = createClient({ connectionString: process.env.POSTGRES_URL });
  await client.connect();
  await client.sql`DELETE FROM users WHERE username = 'developers+test1'`;

  // create an account
  await page.goto("/register");
  await page.fill('input[name="username"]', "developers+test1");
  await page.fill('input[name="email"]', "developers+test1@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');

  await page.fill('input[name="text"]', "My first post");

  // see if the post is created:
  await page.click('button[type="submit"]');
  await page.waitForSelector("li:has-text('My first post')");

  // check if the post exists after reload too
  await page.reload();
  await page.waitForSelector("li:has-text('My first post')");
  await expect(page.locator("li:has-text('My first post')")).toContainText(
    "My first post"
  );

  // cleanup
  await client.sql`DELETE FROM users WHERE username = 'developers+test1'`; // also deletes the post
});
