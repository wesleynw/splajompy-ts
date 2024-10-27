import { test, expect } from "@playwright/test";
import { createClient } from "@vercel/postgres";

test("create a post", async ({ page }) => {
  // TODO: paramaterize account creation
  // delete test user from previous runs
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();
  await client.sql`DELETE FROM users WHERE username = 'developers+a+test1'`;

  // create an account
  await page.goto("/register");
  await page.fill('input[name="username"]', "developers+a+test1");
  await page.fill('input[name="email"]', "developers+a+test1@splajompy.com");
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
  await client.sql`DELETE FROM users WHERE username = 'developers+a+test1'`; // also deletes the post
});

test("create a post and make sure other users can see it", async ({ page }) => {
  // delete test user from previous runs
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();
  await client.sql`DELETE FROM users WHERE username = 'developers+a+test2'`;

  // create an account
  await page.goto("/register");
  await page.fill('input[name="username"]', "developers+a+test2");
  await page.fill('input[name="email"]', "developers+a+test2@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');

  // post
  await page.fill('input[name="text"]', "My second post");
  await page.click('button[type="submit"]');
  await page.waitForSelector("li:has-text('My second post')");
  await page.click('button:has-text("Sign Out")');

  // create another account
  await page.goto("/register");
  await page.fill('input[name="username"]', "developers+a+test3");
  await page.fill('input[name="email"]', "developers+a+test3@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');

  // check if the post is visible
  await page.waitForSelector("li:has-text('My second post')");
  await expect(page.locator("li:has-text('My second post')")).toContainText(
    "My second post"
  );

  // cleanup
  await client.sql`DELETE FROM users WHERE username = 'developers+a+test2'`;
  await client.sql`DELETE FROM users WHERE username = 'developers+a+test3'`;
});
