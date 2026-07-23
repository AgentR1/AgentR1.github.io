import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const pagePath = resolve(scriptDir, "../papers/index.html");
const html = await readFile(pagePath, "utf8");

const check = (condition, message) => assert.ok(condition, message);
const relativeLuminance = (hex) => {
  const channels = hex
    .match(/[a-f\d]{2}/gi)
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};
const contrastRatio = (foreground, background) => {
  const light = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const dark = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (light + 0.05) / (dark + 0.05);
};

check(
  html.includes('<link rel="canonical" href="https://agentr1.github.io/papers/"'),
  "papers page should declare its canonical URL",
);
check(
  html.includes('<meta property="og:title"') &&
    html.includes('<meta property="og:description"') &&
    html.includes('<meta property="og:url"'),
  "papers page should include basic Open Graph metadata",
);
check(
  html.includes('<a class="skip-link" href="#main-content">'),
  "papers page should provide a keyboard skip link",
);
check(
  /<a[^>]+href="\.\.\/papers\/"[^>]+aria-current="page"/.test(html),
  "papers navigation item should identify the current page",
);
check(
  /<header id="hero-header">\s*<div class="container">/.test(html),
  "hero should use a non-interactive semantic header",
);
check(
  !/<header[^>]+(?:onclick|role="button"|tabindex)/.test(html),
  "hero header should not behave like a page-refresh button",
);
check(
  html.includes('<main id="main-content" tabindex="-1">'),
  "main content should be the skip-link target",
);
check(
  html.includes('id="paper-search"') &&
    html.includes('type="search"') &&
    html.includes('id="paper-search-clear"'),
  "papers page should include search and clear controls",
);
check(
  html.includes('role="group" aria-label="按论文标签筛选"'),
  "paper filters should be exposed as one accessible control group",
);

const filterButtons = html.match(/<button class="paper-filter[^>]*>/g) ?? [];
check(filterButtons.length === 5, "papers page should keep all five filter buttons");
check(
  filterButtons.every((button) => button.includes('aria-controls="publication-results"')),
  "each paper filter should reference the filtered results",
);
check(
  html.includes('id="publication-results"'),
  "filtered publication results should have a stable target",
);
check(
  !/<span class="paper-labels"[^>]*(?:hidden|aria-hidden)/.test(html),
  "paper labels should remain visible to readers and assistive technology",
);
check(
  html.includes('id="paper-empty-state"') && html.includes("没有匹配的论文"),
  "papers page should explain an empty search result",
);
check(
  html.includes('let activeFilter = "all";') &&
    html.includes("const matchesQuery =") &&
    html.includes('searchInput.addEventListener("input"') &&
    html.includes('event.key === "Escape"'),
  "keyword search and label filtering should work together and support Escape to clear",
);
check(
  /\.pub-list\s*\{[^}]*list-style:\s*none/s.test(html) &&
    /\.pub-list li\s*\{[^}]*border:\s*1px solid/s.test(html),
  "publication entries should use a scannable card layout",
);
check(
  /@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(html),
  "papers page should respect reduced-motion preferences",
);
const placeholderColor = html.match(
  /\.search-control input::placeholder\s*\{[^}]*color:\s*(#[a-f\d]{6})/i,
)?.[1];
check(
  placeholderColor && contrastRatio(placeholderColor, "#ffffff") >= 4.5,
  "search placeholder should meet WCAG AA text contrast",
);

const paperItems = html.match(/<li>/g) ?? [];
check(paperItems.length === 15, "all 15 publication entries should be preserved");
check(
  (html.match(/href="https:\/\/arxiv\.org\/pdf\/2510\.10909"/g) ?? []).length === 1,
  "PaperArena should not repeat the same PDF link",
);
check(
  html.includes("StepPO: Step-Aligned Policy Optimization for Agentic Reinforcement Learning") &&
    html.includes("A Survey on Knowledge-Oriented Retrieval-Augmented Generation"),
  "first and last publication records should be preserved",
);

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
check(
  new Set(ids).size === ids.length,
  "papers page should not contain duplicate element IDs",
);

const blankTargetLinks = html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
check(
  blankTargetLinks.every((link) => /\brel="[^"]*\bnoopener\b[^"]*"/.test(link)),
  "links that open a new tab should use rel=noopener",
);

const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
check(inlineScripts.length > 0, "papers page should keep its filter script");
for (const [, source] of inlineScripts) new Function(source);

const localReferences = [...html.matchAll(/\shref="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((href) => !/^[a-z][a-z\d+.-]*:/i.test(href));
for (const reference of localReferences) {
  const [pathPart, fragment] = reference.split("#");
  const resolvedPath = pathPart ? resolve(dirname(pagePath), pathPart) : pagePath;
  const targetPath = (await stat(resolvedPath)).isDirectory()
    ? join(resolvedPath, "index.html")
    : resolvedPath;

  if (fragment) {
    const targetHtml = await readFile(targetPath, "utf8");
    const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    check(
      new RegExp(`\\sid=["']${escapedFragment}["']`).test(targetHtml),
      `local fragment #${fragment} should exist in ${targetPath}`,
    );
  }
}

console.log(
  `papers page checks passed: ${paperItems.length} papers, ${ids.length} unique IDs, ${localReferences.length} local links`,
);
