import { test, expect } from "@playwright/test";
import { createClient } from "@vercel/postgres";

test("create an account and login", async ({ page }) => {
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

  await expect(page).toHaveURL("/");
  await page.click('button:has-text("Sign Out")');
  await expect(page).toHaveURL("/login");

  // log back in
  await page.fill('input[name="identifier"]', "developers+test1");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/");

  // delete test user from db
  await client.sql`DELETE FROM users WHERE username = 'developers+test1'`;
});
