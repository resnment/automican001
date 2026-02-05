export async function runTypewriter(el, lines, opts = {}) {
  const typeSpeed = opts.typeSpeed ?? 28;
  const lineDelay = opts.lineDelay ?? 900;

  for (const line of lines) {
    const row = document.createElement("p");
    row.className = "type-line";
    el.appendChild(row);

    for (let i = 0; i < line.length; i++) {
      row.textContent += line[i];
      await wait(typeSpeed);
    }

    await wait(lineDelay);
  }
}

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}
