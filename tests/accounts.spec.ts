import { test, expect } from "@playwright/test";
import { createClient } from "@vercel/postgres";

test("create an account and login with email", async ({ page }) => {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();

  // delete test user from previous runs
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

test("create account and login with username", async ({ page }) => {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();

  await client.sql`DELETE FROM users WHERE username = 'developers+test2'`;

  // create an account
  await page.goto("/register");
  await page.fill('input[name="username"]', "developers+test2");
  await page.fill('input[name="email"]', "developers+test2@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/");
  await page.click('button:has-text("Sign Out")');
  await expect(page).toHaveURL("/login");

  // log back in with email
  await page.fill('input[name="identifier"]', "developers+test2");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/");

  // delete test user from db
  await client.sql`DELETE FROM users WHERE username = 'developers+test2'`;
});

test("can't login with incorrect password", async ({ page }) => {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();

  // create an account
  await page.goto("/register");
  await page.fill('input[name="username"]', "developers+test3");
  await page.fill('input[name="email"]', "developers+test3@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL("/");
  await page.click('button:has-text("Sign Out")');
  await expect(page).toHaveURL("/login");

  // log back in with incorrect password
  await page.fill('input[name="identifier"]', "developers+test3");
  await page.fill('input[name="password"]', "incorrect-password");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/login");

  // TODO: further checking when we have zod implemented better

  // delete test user from db
  await client.sql`DELETE FROM users WHERE username = 'developers+test3'`;
});

test("can't create account with existing email or username", async ({
  page,
}) => {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();
  await client.sql`DELETE FROM users WHERE username = 'developers+test4'`;

  // create an account
  await page.goto("/register");
  await page.fill('input[name="username"]', "developers+test4");
  await page.fill('input[name="email"]', "developers+test4@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/");

  await page.click('button:has-text("Sign Out")');
  await expect(page).toHaveURL("/login");
  await page.goto("/register");

  // try same username
  await page.fill('input[name="username"]', "developers+test4");
  await page.fill('input[name="email"]', "developers+test4+asdf@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/register");

  await page.reload();

  // try same email
  await page.fill('input[name="username"]', "developers+test4+asdf");
  await page.fill('input[name="email"]', "developers+test4@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/register");

  // accounts with different email and usernames shouldn't work
  await page.goto("/login");
  await page.fill('input[name="identifier"]', "developers+test4+asdf");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/login");

  await page.fill(
    'input[name="identifier"]',
    "developers+test4+asdf@splajompy.com"
  );
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/login");

  // delete test user from db
  await client.sql`DELETE FROM users WHERE username = 'developers+test4'`;
});

test("usernames and emails aren't case sensitive, passwords are", async ({
  page,
}) => {
  const client = createClient({
    connectionString: process.env.POSTGRES_URL_NON_POOLING,
  });
  await client.connect();

  await client.sql`DELETE FROM users WHERE username = 'developers+test5'`;

  // create an account
  await page.goto("/register");
  await page.fill('input[name="username"]', "developers+test5");
  await page.fill('input[name="email"]', "developers+test5@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/");
  await page.click('button:has-text("Sign Out")');

  // try logging in with different case email
  await page.fill('input[name="identifier"]', "developeRs+tEsT5");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/");
  await page.click('button:has-text("Sign Out")');

  // try logging in with different case username
  await page.fill('input[name="identifier"]', "deVELopers+tEST5@splajompy.com");
  await page.fill('input[name="password"]', "b7NBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/");
  await page.click('button:has-text("Sign Out")');

  // try logging in with different case password
  await page.fill('input[name="identifier"]', "developers+test5");
  await page.fill('input[name="password"]', "b7nBsmzkiKnFumaMFifz$");
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("/login");

  // delete test user from db
  await client.sql`DELETE FROM users WHERE username = 'developers+test5'`;
});
