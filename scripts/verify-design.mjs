import fs from "node:fs";
import assert from "node:assert/strict";
const design = fs.readFileSync("DESIGN.md", "utf8");
const css = fs.readFileSync("src/index.css", "utf8");
const colors = design.match(/colors:\n([\s\S]*?)\ntypography:/)[1];
let checked = 0;
for (const [, name, value] of colors.matchAll(
  / {2}([\w-]+): "(#[a-f\d]+)"/gi,
)) {
  assert.ok(
    new RegExp(`--color-${name}:\\s*${value}`, "i").test(css),
    `Token drift: ${name}`,
  );
  checked++;
}
for (const [token, value] of [
  ["radius-control", "0.5rem"],
  ["radius-panel", "0.875rem"],
  ["space-section", "1.75rem"],
  ["space-page", "2.5rem"],
]) {
  const actual = css.match(new RegExp(`--${token}:\\s*([^;]+)`))?.[1].trim();
  assert.equal(parseFloat(actual), parseFloat(value), `Token drift: ${token}`);
}
assert.equal(checked, 13);
console.log(`Design tokens match: ${checked} colors, 4 geometry tokens.`);
