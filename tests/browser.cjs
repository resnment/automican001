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
      viewport: { width: 1440, height: 1000 },
      acceptDownloads: true,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base);
    await page.getByRole("heading", { name: /Big ambitions/ }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await check(
      "Landing content, local fonts, scrollbar, links and desktop accessibility",
      async () => {
        assert.match(await page.title(), /Automican/);
        assert.equal(await page.locator(".team-card").count(), 4);
        assert.equal(await page.locator('a[href="#"]').count(), 0);
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
        await a11y(page, "desktop");
        await page.screenshot({
          path: "artifacts/desktop.png",
          fullPage: true,
        });
        await page.screenshot({ path: "artifacts/hero.png" });
      },
    );
    await check(
      "Team details: keyboard focus, native dialog trap, Escape and restoration",
      async () => {
        const trigger = page.getByRole("button", {
          name: "Explore the Origin team",
        });
        await trigger.click();
        const dialog = page.locator("dialog[open]");
        await dialog
          .getByRole("heading", { name: "Origin team", exact: true })
          .waitFor();
        assert.equal(await dialog.locator(".detail-roles>div").count(), 7);
        for (let i = 0; i < 9; i++) {
          await page.keyboard.press("Tab");
          assert.equal(
            await page.evaluate(
              () =>
                !!document.activeElement.closest("dialog[open]") ||
                document.activeElement.tagName === "DIALOG",
            ),
            true,
          );
        }
        await a11y(page, "team");
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("dialog[open]").count(), 0);
        assert.equal(
          await trigger.evaluate((el) => el === document.activeElement),
          true,
        );
      },
    );
    await check(
      "Role explorer: search, IME, clear, no-results, native filter, paging and history",
      async () => {
        await page
          .getByRole("button", { name: /Meet every specialist/ })
          .click();
        const search = page.getByRole("searchbox", {
          name: "Search agent roles",
        });
        await search.fill("doesnotexist");
        await page.getByText("No matching roles").waitFor();
        await page
          .getByRole("button", { name: "Clear search", exact: true })
          .click();
        assert.equal(
          await search.evaluate((el) => el === document.activeElement),
          true,
        );
        assert.match(
          await page.locator(".table-footer").innerText(),
          /1–5 of 30 roles/,
        );
        await search.dispatchEvent("compositionstart");
        await search.fill("engineer");
        assert.equal(new URL(page.url()).searchParams.get("q"), null);
        await search.dispatchEvent("compositionend");
        assert.equal(new URL(page.url()).searchParams.get("q"), "engineer");
        await page
          .getByRole("button", { name: "Clear search", exact: true })
          .click();
        const select = page.getByLabel("Filter by department");
        await select.focus();
        await page.keyboard.press("Space");
        await page.keyboard.press("Escape");
        await select.selectOption("Development");
        assert.match(
          await page.locator(".table-footer").innerText(),
          /1–5 of 9 roles/,
        );
        await page
          .getByRole("button", { name: "Next page", exact: true })
          .click();
        assert.match(
          await page.locator(".table-footer").innerText(),
          /6–9 of 9 roles/,
        );
        await page.goBack();
        assert.match(
          await page.locator(".table-footer").innerText(),
          /1–5 of 9 roles/,
        );
        await page
          .getByRole("button", { name: "Agent role", exact: true })
          .click();
        assert.equal(
          await page.locator("th[aria-sort]").getAttribute("aria-sort"),
          "descending",
        );
        await page
          .getByRole("button", { name: "UX/UI Designer", exact: true })
          .click();
        const dialog = page.locator("dialog[open]");
        await dialog.getByText("What this role brings").waitFor();
        await dialog.getByRole("button", { name: "Discuss this role" }).click();
        assert.equal(
          await page.locator("#inquiry-team").inputValue(),
          "UX/UI Designer",
        );
        await page.keyboard.press("Escape");
        await a11y(page, "registry");
      },
    );
    await check(
      "Detail-to-inquiry handoff, validation, label association and draft preservation",
      async () => {
        await page
          .getByRole("button", { name: "Explore the Development team" })
          .click();
        await page
          .locator("dialog[open]")
          .getByRole("button", { name: "Discuss this team" })
          .click();
        let dialog = page.locator("dialog[open]");
        assert.equal(
          await dialog.locator("#inquiry-team").inputValue(),
          "Development team",
        );
        await dialog.getByRole("button", { name: "Review inquiry" }).click();
        assert.equal(
          await page.locator("#inquiry-name").getAttribute("aria-invalid"),
          "true",
        );
        assert.equal(
          await page
            .locator("#inquiry-name")
            .evaluate((el) => el === document.activeElement),
          true,
        );
        await dialog.getByText("Your name", { exact: true }).click();
        assert.equal(
          await page
            .locator("#inquiry-name")
            .evaluate((el) => el === document.activeElement),
          true,
        );
        await dialog
          .getByLabel("Your name", { exact: true })
          .fill("Alex Morgan");
        await dialog
          .getByLabel("Organization", { exact: true })
          .fill("Example Institute");
        await dialog
          .getByLabel("Work email", { exact: true })
          .fill("not-an-email");
        await dialog
          .getByLabel("What would you like your agents to do?")
          .fill(
            "Coordinate our research workflow and prepare weekly reports for review.",
          );
        await dialog.getByRole("button", { name: "Review inquiry" }).click();
        assert.equal(
          await page.locator("#inquiry-email").getAttribute("aria-invalid"),
          "true",
        );
        await dialog
          .getByLabel("Work email", { exact: true })
          .fill("alex@example.org");
        await a11y(page, "inquiry");
        await page.keyboard.press("Escape");
        assert.equal(
          await page
            .getByRole("button", { name: "Explore the Development team" })
            .evaluate((el) => el === document.activeElement),
          true,
        );
        await page
          .getByRole("button", { name: "Let’s talk", exact: true })
          .click();
        dialog = page.locator("dialog[open]");
        assert.equal(
          await dialog.getByLabel("Your name", { exact: true }).inputValue(),
          "Alex Morgan",
        );
        await dialog.getByRole("button", { name: "Review inquiry" }).click();
        await dialog
          .getByRole("heading", { name: "Your inquiry brief" })
          .waitFor();
        assert.equal(
          await dialog
            .getByRole("heading", { name: "Your inquiry brief" })
            .evaluate((el) => el === document.activeElement),
          true,
        );
      },
    );
    await check(
      "Inquiry email recipient, encoded values, file download and failure/retry",
      async () => {
        const dialog = page.locator("dialog[open]");
        const href = await dialog
          .getByRole("link", { name: "Open email draft" })
          .getAttribute("href");
        assert.ok(href.startsWith("mailto:automicanhq@gmail.com?"));
        const mail = new URL(href);
        assert.match(mail.searchParams.get("body"), /Example Institute/);
        assert.match(mail.searchParams.get("body"), /alex@example.org/);
        await a11y(page, "review");
        await dialog.screenshot({ path: "artifacts/inquiry.png" });
        await page.evaluate(() => {
          window.originalCreateURL = URL.createObjectURL;
          URL.createObjectURL = () => {
            throw new Error("Test download failure");
          };
        });
        await dialog.getByRole("button", { name: "Download brief" }).click();
        await dialog.getByRole("alert").waitFor();
        assert.match(await dialog.getByRole("alert").innerText(), /Try again/);
        await page.evaluate(() => {
          URL.createObjectURL = window.originalCreateURL;
        });
        const downloaded = page.waitForEvent("download");
        await dialog.getByRole("button", { name: "Download brief" }).click();
        const download = await downloaded;
        assert.equal(download.suggestedFilename(), "automican-inquiry.txt");
        assert.match(
          fs.readFileSync(await download.path(), "utf8"),
          /automicanhq@gmail.com/,
        );
        await page.keyboard.press("Escape");
      },
    );
    await check(
      "Phone: reflow, topology separation, menu Escape, FAQ and modal access",
      async () => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(base);
        await page.getByRole("heading", { name: /Big ambitions/ }).waitFor();
        await page.evaluate(() => document.fonts.ready);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        const core = await page.locator(".orchestrator").boundingBox();
        for (const node of await page.locator(".map-node").all()) {
          const rect = await node.boundingBox();
          const overlapping =
            rect.x < core.x + core.width &&
            rect.x + rect.width > core.x &&
            rect.y < core.y + core.height &&
            rect.y + rect.height > core.y;
          assert.equal(
            overlapping,
            false,
            "Topology nodes must not obscure central text",
          );
        }
        await page.getByRole("button", { name: "Open navigation" }).click();
        assert.equal(await page.locator(".main-nav").isVisible(), true);
        await page.keyboard.press("Escape");
        assert.equal(
          await page
            .getByRole("button", { name: "Open navigation" })
            .evaluate((el) => el === document.activeElement),
          true,
        );
        await page
          .getByText("What is an AI agent swarm?", { exact: true })
          .click();
        assert.equal(
          await page.locator(".faq-list details").first().getAttribute("open"),
          "",
        );
        await a11y(page, "mobile");
        await page.screenshot({ path: "artifacts/mobile.png", fullPage: true });
        await page
          .getByRole("button", { name: "Request a custom build" })
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
          .getByLabel("What would you like your agents to do?")
          .fill("A ".repeat(200));
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
        await page.setViewportSize({ width: 320, height: 700 });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
        await page.setViewportSize({ width: 768, height: 600 });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
      },
    );
    await check(
      "Offline local workflow, reduced motion and invalid URL recovery",
      async () => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        assert.equal(
          await page.evaluate(
            () => getComputedStyle(document.documentElement).scrollBehavior,
          ),
          "auto",
        );
        await context.setOffline(true);
        await page
          .getByRole("button", { name: "Explore the Revenue team" })
          .click();
        await page
          .locator("dialog[open]")
          .getByRole("heading", { name: "Revenue team", exact: true })
          .waitFor();
        await page.keyboard.press("Escape");
        await context.setOffline(false);
        await page.goto(`${base}/?department=Growth&page=999`);
        await page.getByRole("heading", { name: /Big ambitions/ }).waitFor();
        await page.waitForFunction(
          () => new URL(location.href).searchParams.get("page") === "2",
        );
        assert.match(
          await page.locator(".table-footer").innerText(),
          /6–7 of 7 roles/,
        );
        await page.emulateMedia({ forcedColors: "active" });
        assert.equal(
          await page.evaluate(
            () => getComputedStyle(document.documentElement).scrollbarColor,
          ),
          "auto",
        );
        assert.deepEqual(errors, []);
      },
    );
    fs.writeFileSync(
      "artifacts/browser-results.json",
      JSON.stringify(
        { passed: results.length, checks: results, runtimeErrors: errors },
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
