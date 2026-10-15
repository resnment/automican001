const assert = require("node:assert/strict");
const fs = require("node:fs");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");
const { default: AxeBuilder } = require("@axe-core/playwright");
const base = "http://127.0.0.1:4175";
const server = spawn(
  "npm",
  ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4175", "--strictPort"],
  { stdio: "ignore", detached: true },
);
const results = [];
let browser;
const check = async (name, fn) => {
  await fn();
  results.push({ name, passed: true });
  console.log(`PASS ${name}`);
};
async function ready() {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch(base)).ok) return;
    } catch {
      /* Server is starting. */
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Preview server failed to start.");
}
async function a11y(page, name) {
  const report = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const failures = report.violations.filter((v) =>
    ["critical", "serious"].includes(v.impact),
  );
  fs.writeFileSync(
    `artifacts/a11y-${name}.json`,
    JSON.stringify(report.violations, null, 2),
  );
  assert.deepEqual(
    failures.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
    [],
    name,
  );
}
(async () => {
  fs.mkdirSync("artifacts", { recursive: true });
  try {
    await ready();
    browser = await chromium.launch({
      executablePath:
        process.env.CHROMIUM_PATH ||
        (fs.existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
      headless: true,
      args: ["--no-sandbox"],
    });
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1050 },
      acceptDownloads: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base);
    await page.getByRole("heading", { name: /Your next AI hire/ }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await check(
      "New employee catalog, audience wording, readable type, local assets and accessibility",
      async () => {
        assert.match(await page.title(), /AI employees/);
        assert.equal(await page.locator(".employee-card").count(), 6);
        const audience = await page.locator(".audience-list").innerText();
        for (const word of [
          "Companies",
          "Organizations",
          "Institutions",
          "Personal",
        ])
          assert.match(audience, new RegExp(word));
        assert.doesNotMatch(audience, /Offices/);
        assert.equal(
          await page.getByText("Origin Chief", { exact: true }).count(),
          0,
        );
        const undersized = await page
          .locator("p,span,a,button,summary,label")
          .evaluateAll((nodes) =>
            nodes
              .filter(
                (e) =>
                  e.getClientRects().length &&
                  parseFloat(getComputedStyle(e).fontSize) < 14,
              )
              .map((e) => ({
                text: e.textContent.slice(0, 50),
                size: getComputedStyle(e).fontSize,
              })),
          );
        assert.deepEqual(undersized, []);
        assert.notEqual(
          await page.evaluate(
            () => getComputedStyle(document.documentElement).scrollbarColor,
          ),
          "auto",
        );
        assert.equal(
          await page.evaluate(() => document.fonts.check("500 16px Manrope")),
          true,
        );
        for (const phrase of [
          "A LITTLE INTRODUCTION",
          "ONE PLATFORM. YOUR KIND OF WORK.",
          "Meet me",
          "SM / AI EMPLOYEE",
        ])
          assert.equal(
            await page.getByText(phrase, { exact: true }).count(),
            0,
          );
        assert.equal(await page.locator(".hero-constellation").count(), 0);
        for (const card of await page.locator(".employee-card").all())
          assert.ok(
            (await card.boundingBox()).height <= 340,
            "Employee cards stay compact",
          );
        for (const card of await page.locator(".framework-card").all())
          assert.ok(
            (await card.boundingBox()).height <= 120,
            "Framework cards have no padded empty rows",
          );
        const buttonSizes = await page.locator(".button").evaluateAll((nodes) =>
          nodes
            .filter((el) => el.getClientRects().length)
            .map((el) => ({
              font: getComputedStyle(el).fontSize,
              height: el.getBoundingClientRect().height,
            })),
        );
        assert.ok(
          buttonSizes.every((x) => x.font === "15px" && x.height >= 44),
        );
        await a11y(page, "desktop");
        await page.screenshot({
          path: "artifacts/desktop.png",
          fullPage: true,
        });
        await page.screenshot({ path: "artifacts/hero.png" });
      },
    );
    await check(
      "Avatar hover introduction, raised hand, hoverable content and keyboard dismissal",
      async () => {
        const owner = page.locator(".hero-avatar");
        const trigger = owner.locator(".avatar-trigger");
        await trigger.hover();
        await owner.locator(".avatar-speech").waitFor({ state: "visible" });
        assert.match(
          await owner.locator(".avatar-speech").innerText(),
          /AI Social Media Manager/,
        );
        await page.waitForFunction(() => {
          const el = document.querySelector(".hero-avatar .avatar-wave-arm");
          const t = getComputedStyle(el).transform;
          return t !== "none" && !t.startsWith("matrix(1,");
        });
        assert.equal(await owner.locator(".avatar-speech button").count(), 0);
        await owner.locator(".avatar-speech").hover();
        assert.equal(await trigger.getAttribute("aria-expanded"), "true");
        await page.screenshot({ path: "artifacts/avatar-greeting.png" });
        await trigger.focus();
        await page.keyboard.press("Escape");
        assert.equal(await trigger.getAttribute("aria-expanded"), "false");
        assert.equal(
          await trigger.evaluate((el) => el === document.activeElement),
          true,
        );
        await page.mouse.move(0, 0);
        await page.keyboard.press("Tab");
        const cardTrigger = page
          .locator(".employee-card")
          .first()
          .locator(".avatar-trigger");
        await cardTrigger.focus();
        assert.equal(await cardTrigger.getAttribute("aria-expanded"), "true");
        await page.keyboard.press("Escape");
        assert.equal(await cardTrigger.getAttribute("aria-expanded"), "false");
        assert.equal(
          await cardTrigger.evaluate((el) => el === document.activeElement),
          true,
        );
      },
    );
    await check(
      "Employee search, IME composition, no-results, filters, history, load more and focus",
      async () => {
        const search = page.getByRole("searchbox", {
          name: "Search AI employees",
        });
        await search.fill("unfindable role");
        await page
          .getByRole("heading", { name: "No employees found" })
          .waitFor();
        await page
          .getByRole("button", { name: "Clear employee search" })
          .click();
        assert.equal(
          await search.evaluate((el) => el === document.activeElement),
          true,
        );
        await search.dispatchEvent("compositionstart");
        await search.fill("accountant");
        assert.equal(new URL(page.url()).searchParams.get("q"), null);
        await search.dispatchEvent("compositionend");
        assert.equal(new URL(page.url()).searchParams.get("q"), "accountant");
        assert.equal(await page.locator(".employee-card").count(), 1);
        await page
          .getByRole("button", { name: "Clear employee search" })
          .click();
        await page
          .getByRole("group", { name: "Employee categories" })
          .getByRole("button", { name: "Personal", exact: true })
          .click();
        assert.equal(await page.locator(".employee-card").count(), 1);
        assert.equal(
          new URL(page.url()).searchParams.get("category"),
          "Personal",
        );
        await page.goBack();
        assert.equal(await page.locator(".employee-card").count(), 6);
        await page
          .getByRole("button", { name: "Meet all 12 employees" })
          .click();
        assert.equal(await page.locator(".employee-card").count(), 12);
        assert.equal(
          await page
            .locator("#employee-ecommerce .avatar-trigger")
            .evaluate((el) => el === document.activeElement),
          true,
        );
        for (const card of await page.locator(".employee-card").all())
          assert.equal(
            await card.getByRole("button", { name: /^Hire / }).count(),
            1,
          );
        await page.keyboard.press("Escape");
      },
    );
    await check(
      "Role details, native modal keyboard trap, Hire/Build handoff and focus restoration",
      async () => {
        const entry = page.getByRole("button", {
          name: "View Accountant details",
        });
        await entry.click();
        let dialog = page.locator("dialog[open]");
        await dialog
          .getByRole("heading", { name: "AI Accountant", exact: true })
          .waitFor();
        assert.match(await dialog.innerText(), /reconciliation/);
        for (let i = 0; i < 9; i++) {
          await page.keyboard.press("Tab");
          assert.equal(
            await page.evaluate(
              () => !!document.activeElement.closest("dialog[open]"),
            ),
            true,
          );
        }
        await a11y(page, "employee-detail");
        await dialog.getByRole("button", { name: "Build this role" }).click();
        dialog = page.locator("dialog[open]");
        assert.equal(
          await dialog.getByLabel("I want to", { exact: true }).inputValue(),
          "Build",
        );
        assert.equal(
          await dialog
            .getByLabel("Employee role", { exact: true })
            .inputValue(),
          "AI Accountant",
        );
        await page.keyboard.press("Escape");
        assert.equal(
          await entry.evaluate((el) => el === document.activeElement),
          true,
        );
        await page
          .getByRole("button", { name: "Hire Accountant", exact: true })
          .click();
        assert.equal(
          await page.locator("#inquiry-intent").inputValue(),
          "Hire",
        );
        assert.equal(
          await page.locator("#inquiry-team").inputValue(),
          "AI Accountant",
        );
        await page.keyboard.press("Escape");
      },
    );
    await check(
      "Framework catalog, official source links, category filters and Build context",
      async () => {
        assert.equal(await page.locator(".framework-card").count(), 8);
        await page
          .getByRole("button", { name: "Explore all 16 options" })
          .click();
        assert.equal(await page.locator(".framework-card").count(), 16);
        for (const card of await page.locator(".framework-card").all()) {
          const docs = card.getByRole("link", {
            name: /official documentation/,
          });
          assert.ok((await docs.getAttribute("href")).startsWith("https://"));
          assert.equal(await docs.getAttribute("rel"), "noreferrer");
        }
        await page
          .getByRole("group", { name: "Framework types" })
          .getByRole("button", { name: "Agent platforms", exact: true })
          .click();
        assert.equal(await page.locator(".framework-card").count(), 3);
        await page
          .getByRole("heading", { name: "ChatGPT dots", exact: true })
          .waitFor();
        await page
          .getByRole("group", { name: "Framework types" })
          .getByRole("button", { name: "All", exact: true })
          .click();
        await page
          .getByRole("button", { name: "Build with Google ADK", exact: true })
          .click();
        const dialog = page.locator("dialog[open]");
        assert.equal(
          await dialog.getByLabel("I want to", { exact: true }).inputValue(),
          "Build",
        );
        assert.equal(
          await dialog
            .getByLabel("Preferred framework or platform")
            .inputValue(),
          "Google ADK",
        );
        const native = dialog.getByLabel("Preferred framework or platform");
        await native.focus();
        await page.keyboard.press("Space");
        await page.keyboard.press("Escape");
        assert.equal(await dialog.isVisible(), true);
        await page.keyboard.press("Escape");
        assert.match(
          await page.locator(".connection-note").innerText(),
          /Connect agents with A2A and tools with MCP/,
        );
      },
    );
    await check(
      "Personal inquiry: optional organization, validation, labels, retained draft and review",
      async () => {
        await page
          .getByRole("button", { name: "Hire Personal Assistant", exact: true })
          .click();
        let dialog = page.locator("dialog[open]");
        assert.equal(
          await dialog.getByLabel("This is for", { exact: true }).inputValue(),
          "Personal",
        );
        assert.equal(
          await dialog
            .getByLabel("Organization (optional)")
            .getAttribute("required"),
          null,
        );
        await dialog.getByRole("button", { name: "Review inquiry" }).click();
        assert.equal(
          await dialog
            .getByLabel("Your name", { exact: true })
            .getAttribute("aria-invalid"),
          "true",
        );
        assert.equal(
          await dialog
            .getByLabel("Your name", { exact: true })
            .evaluate((el) => el === document.activeElement),
          true,
        );
        await dialog.getByText("Your name", { exact: true }).click();
        assert.equal(
          await dialog
            .getByLabel("Your name", { exact: true })
            .evaluate((el) => el === document.activeElement),
          true,
        );
        await dialog
          .getByLabel("Your name", { exact: true })
          .fill("রহিম Hasan");
        await dialog
          .getByLabel("Email address", { exact: true })
          .fill("invalid-address");
        await dialog
          .getByLabel("What work would you like help with?")
          .fill(
            "Help me organize my weekly priorities and draft routine messages for my review.",
          );
        await dialog.getByRole("button", { name: "Review inquiry" }).click();
        assert.equal(
          await dialog
            .getByLabel("Email address", { exact: true })
            .getAttribute("aria-invalid"),
          "true",
        );
        await dialog
          .getByLabel("Email address", { exact: true })
          .fill("rahim@example.org");
        await a11y(page, "inquiry");
        await page.keyboard.press("Escape");
        await page
          .getByRole("button", {
            name: "Build Personal Assistant",
            exact: true,
          })
          .click();
        dialog = page.locator("dialog[open]");
        assert.equal(
          await dialog.getByLabel("Your name", { exact: true }).inputValue(),
          "রহিম Hasan",
        );
        assert.equal(
          await dialog.getByLabel("I want to", { exact: true }).inputValue(),
          "Build",
        );
        await dialog
          .getByLabel("Preferred framework or platform")
          .selectOption("n8n");
        await dialog.getByRole("button", { name: "Review inquiry" }).click();
        const review = dialog.getByRole("heading", {
          name: "Your inquiry brief",
        });
        await review.waitFor();
        assert.equal(
          await review.evaluate((el) => el === document.activeElement),
          true,
        );
        assert.match(await dialog.innerText(), /Personal use/);
      },
    );
    await check(
      "Email draft and download retain intent, role, audience and framework; error/retry works",
      async () => {
        const dialog = page.locator("dialog[open]");
        const href = await dialog
          .getByRole("link", { name: "Open email draft" })
          .getAttribute("href");
        assert.ok(href.startsWith("mailto:automicanhq@gmail.com?"));
        const mail = new URL(href);
        for (const text of [
          "Build",
          "AI Personal Assistant",
          "Personal",
          "n8n",
          "rahim@example.org",
        ])
          assert.ok(mail.searchParams.get("body").includes(text));
        await a11y(page, "review");
        await dialog.screenshot({ path: "artifacts/inquiry.png" });
        await page.evaluate(() => {
          window.originalCreateURL = URL.createObjectURL;
          URL.createObjectURL = () => {
            throw new Error("Injected download failure");
          };
        });
        await dialog.getByRole("button", { name: "Download brief" }).click();
        await dialog.getByRole("alert").waitFor();
        assert.match(await dialog.getByRole("alert").innerText(), /Try again/);
        await page.evaluate(() => {
          URL.createObjectURL = window.originalCreateURL;
        });
        const pending = page.waitForEvent("download");
        await dialog.getByRole("button", { name: "Download brief" }).click();
        const download = await pending;
        const text = fs.readFileSync(await download.path(), "utf8");
        for (const expected of [
          "Request: Build",
          "AI Personal Assistant",
          "Personal",
          "n8n",
          "automicanhq@gmail.com",
        ])
          assert.ok(text.includes(expected));
        assert.equal(await dialog.locator(".toast.visible").count(), 1);
        await page.keyboard.press("Escape");
      },
    );
    await check(
      "Company inquiry still requires an organization; clear draft is confirmed",
      async () => {
        await page
          .getByRole("button", { name: "Let’s build", exact: true })
          .click();
        const dialog = page.locator("dialog[open]");
        await dialog
          .getByLabel("This is for", { exact: true })
          .selectOption("Companies");
        await dialog.getByRole("button", { name: "Review inquiry" }).click();
        assert.equal(
          await page
            .locator("#inquiry-organization")
            .getAttribute("aria-invalid"),
          "true",
        );
        await dialog
          .getByRole("button", { name: "Clear draft…", exact: true })
          .click();
        await dialog
          .getByRole("button", { name: "Keep draft", exact: true })
          .click();
        assert.equal(
          await dialog.getByLabel("Your name", { exact: true }).inputValue(),
          "রহিম Hasan",
        );
        await dialog
          .getByRole("button", { name: "Clear draft…", exact: true })
          .click();
        await dialog
          .getByRole("button", { name: "Clear draft", exact: true })
          .click();
        assert.equal(
          await dialog.getByLabel("Your name", { exact: true }).inputValue(),
          "",
        );
        await page.keyboard.press("Escape");
      },
    );
    await check(
      "Responsive reflow from 320px to desktop and zoom-equivalent width",
      async () => {
        for (const width of [320, 390, 520, 720, 768, 950, 1024, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
            `No whole-page horizontal overflow at ${width}px`,
          );
          const sizes = await page.locator(".button").evaluateAll((nodes) =>
            nodes
              .filter((el) => el.getClientRects().length)
              .map((el) => ({
                font: getComputedStyle(el).fontSize,
                height: el.getBoundingClientRect().height,
              })),
          );
          assert.ok(
            sizes.every((x) => x.font === "15px" && x.height >= 44),
            `Consistent action typography and target size at ${width}px`,
          );
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(base);
        await page
          .getByRole("heading", { name: /Your next AI hire/ })
          .waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.getByRole("button", { name: "Open navigation" }).click();
        assert.equal(await page.locator(".main-nav").isVisible(), true);
        await page.keyboard.press("Escape");
        assert.equal(
          await page
            .getByRole("button", { name: "Open navigation" })
            .evaluate((el) => el === document.activeElement),
          true,
        );
        await page.getByText("Hire or Build?", { exact: true }).click();
        await a11y(page, "mobile");
        await page.screenshot({ path: "artifacts/mobile.png", fullPage: true });
        await page
          .getByRole("button", { name: "Hire Accountant", exact: true })
          .click();
        const dialog = page.locator("dialog[open]");
        const rect = await dialog.boundingBox();
        assert.ok(
          rect.x >= 0 &&
            rect.y >= 0 &&
            rect.x + rect.width <= 390 &&
            rect.y + rect.height <= 844,
        );
        await dialog
          .getByRole("button", { name: "Review inquiry" })
          .scrollIntoViewIfNeeded();
        assert.equal(
          await dialog
            .getByRole("button", { name: "Review inquiry" })
            .isVisible(),
          true,
        );
        await page.keyboard.press("Escape");
      },
    );
    await check(
      "Touch greetings, popup geometry, reduced motion, offline and forced colors",
      async () => {
        const touch = await browser.newContext({
          viewport: { width: 390, height: 844 },
          hasTouch: true,
        });
        const mobile = await touch.newPage();
        await mobile.goto(base);
        await mobile
          .getByRole("heading", { name: /Your next AI hire/ })
          .waitFor();
        const owner = mobile
          .locator(".employee-card")
          .first()
          .locator(".avatar-greeting");
        await owner.locator(".avatar-trigger").tap();
        const bubble = owner.locator(".avatar-speech");
        await bubble.waitFor({ state: "visible" });
        const rect = await bubble.boundingBox();
        assert.ok(
          rect.x >= 0 && rect.x + rect.width <= 390,
          "Touch speech bubble fits the viewport",
        );
        await owner.locator(".avatar-trigger").tap();
        assert.equal(
          await owner.locator(".avatar-trigger").getAttribute("aria-expanded"),
          "false",
        );
        await owner.locator(".avatar-trigger").tap();
        await mobile
          .locator(".employee-card")
          .first()
          .locator(".employee-summary")
          .tap();
        assert.equal(
          await owner.locator(".avatar-trigger").getAttribute("aria-expanded"),
          "false",
          "Outside tap dismisses a greeting without a close button",
        );
        await mobile.emulateMedia({ reducedMotion: "reduce" });
        await owner.locator(".avatar-trigger").tap();
        assert.equal(
          await owner
            .locator(".avatar-hand")
            .evaluate((el) => getComputedStyle(el).animationName),
          "none",
        );
        assert.equal(
          await owner
            .locator(".avatar-wave-arm")
            .evaluate((el) => getComputedStyle(el).transitionDuration),
          "0s",
        );
        await mobile.keyboard.press("Escape");
        await touch.setOffline(true);
        await mobile
          .getByRole("button", { name: "View Accountant details" })
          .click();
        await mobile
          .locator("dialog[open]")
          .getByRole("heading", { name: "AI Accountant", exact: true })
          .waitFor();
        await mobile.keyboard.press("Escape");
        await touch.setOffline(false);
        await mobile.emulateMedia({ forcedColors: "active" });
        assert.equal(
          await mobile.evaluate(
            () => getComputedStyle(document.documentElement).scrollbarColor,
          ),
          "auto",
        );
        await touch.close();
        assert.deepEqual(errors, []);
      },
    );
    fs.writeFileSync(
      "artifacts/browser-results.json",
      JSON.stringify(
        {
          passed: results.length,
          checks: results,
          runtimeErrors: errors,
          screenReader:
            "Not available; keyboard and automated accessibility checks performed.",
        },
        null,
        2,
      ),
    );
    console.log(`\n${results.length} browser workflow groups passed.`);
  } finally {
    await browser?.close();
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      /* Already stopped. */
    }
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
