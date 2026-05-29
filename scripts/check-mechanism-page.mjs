import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;

function read(relativePath) {
  return readFileSync(join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const pagePath = "reasoning-agent-mechanism/index.html";
assert(existsSync(join(root, pagePath)), `${pagePath} should exist`);

const page = read(pagePath);
const home = read("index.html");
const tracks = read("research-tracks/index.html");

const requiredPageText = [
  "大模型推理与智能体机理分析",
  "大模型思维链推理机理",
  "大模型智能体机理",
  "推理链路",
  "任务分解",
  "工具调用",
  "记忆与反思",
];

for (const text of requiredPageText) {
  assert(page.includes(text), `${pagePath} should include "${text}"`);
}

const requiredAnchors = [
  'id="overview"',
  'id="reasoning"',
  'id="agent-mechanism"',
  'id="diagnosis"',
];

for (const anchor of requiredAnchors) {
  assert(page.includes(anchor), `${pagePath} should include ${anchor}`);
}

assert(
  home.includes('href="reasoning-agent-mechanism/"') &&
    home.includes("大模型推理与智能体机理分析"),
  'index.html should link the mechanism card to "reasoning-agent-mechanism/"',
);

assert(
  tracks.includes('href="reasoning-agent-mechanism/"') &&
    tracks.includes("大模型推理与智能体机理分析"),
  'research-tracks/index.html should link the mechanism card to "reasoning-agent-mechanism/"',
);

console.log("Mechanism page structure check passed.");
