# AgenticRL Card Copy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three AgenticRL cards with the approved research-direction copy on both duplicated page surfaces and publish the result.

**Architecture:** Keep the current static HTML structure, classes, icons, buttons, links, and responsive layout unchanged. Apply the same title, description, and three research points to `index.html` and `research-tracks/index.html`, then verify exact cross-page parity before committing and pushing.

**Tech Stack:** Static HTML, Node.js assertions, Git

---

### Task 1: Synchronize the three AgenticRL cards

**Files:**
- Modify: `index.html:961`
- Modify: `research-tracks/index.html:869`
- Create: `docs/superpowers/plans/2026-07-17-agenticrl-card-copy.md`

- [x] **Step 1: Run the desired-copy assertion before editing**

Run:

```bash
node <<'NODE'
const fs = require('fs');
const files = ['index.html', 'research-tracks/index.html'];
const expected = [
  'AgenticRL训练系统',
  '研究面向多轮工具交互的统一训练系统，打通环境执行、轨迹采样、奖励反馈与策略更新。',
  '工作流 · 环境 · 轨迹 · 优化模块解耦',
  '步级交互建模 · 灵活上下文管理 · 多算法支持',
  '代表项目：Agent-R1',
  '研究多轮交互中的优势估计、信用分配与奖励机制，提升长程任务的策略优化效率与稳定性。',
  '步级 / 序列级轨迹建模',
  '优势估计 · 信用分配 · 过程奖励',
  '代表方法：StepPO · PSPO',
  '研究面向智能体能力提升的数据基础设施，打通多源轨迹采集、质量评估、数据策划与训练供给。',
  '多源交互轨迹采集与统一表示',
  '质量评估 · 能力增益建模 · 数据选择与调度',
  '代表项目：Claw-R1'
];
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const text of expected) {
    if (!html.includes(text)) throw new Error(`${file} missing: ${text}`);
  }
}
NODE
```

Expected: FAIL with `index.html missing: AgenticRL训练系统`.

- [x] **Step 2: Replace the card copy on both pages**

Use the following exact content while preserving the existing HTML wrappers and icons:

```text
AgenticRL训练系统
研究面向多轮工具交互的统一训练系统，打通环境执行、轨迹采样、奖励反馈与策略更新。
工作流 · 环境 · 轨迹 · 优化模块解耦
步级交互建模 · 灵活上下文管理 · 多算法支持
代表项目：Agent-R1

AgenticRL优化算法
研究多轮交互中的优势估计、信用分配与奖励机制，提升长程任务的策略优化效率与稳定性。
步级 / 序列级轨迹建模
优势估计 · 信用分配 · 过程奖励
代表方法：StepPO · PSPO

AgenticRL数据工程
研究面向智能体能力提升的数据基础设施，打通多源轨迹采集、质量评估、数据策划与训练供给。
多源交互轨迹采集与统一表示
质量评估 · 能力增益建模 · 数据选择与调度
代表项目：Claw-R1
```

- [x] **Step 3: Run the desired-copy assertion after editing**

Run:

```bash
node <<'NODE'
const fs = require('fs');
const files = ['index.html', 'research-tracks/index.html'];
const expected = [
  'AgenticRL训练系统',
  '研究面向多轮工具交互的统一训练系统，打通环境执行、轨迹采样、奖励反馈与策略更新。',
  '工作流 · 环境 · 轨迹 · 优化模块解耦',
  '步级交互建模 · 灵活上下文管理 · 多算法支持',
  '代表项目：Agent-R1',
  '研究多轮交互中的优势估计、信用分配与奖励机制，提升长程任务的策略优化效率与稳定性。',
  '步级 / 序列级轨迹建模',
  '优势估计 · 信用分配 · 过程奖励',
  '代表方法：StepPO · PSPO',
  '研究面向智能体能力提升的数据基础设施，打通多源轨迹采集、质量评估、数据策划与训练供给。',
  '多源交互轨迹采集与统一表示',
  '质量评估 · 能力增益建模 · 数据选择与调度',
  '代表项目：Claw-R1'
];
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const text of expected) {
    if (!html.includes(text)) throw new Error(`${file} missing: ${text}`);
  }
}
NODE
```

Expected: exit code 0 with no output.

- [x] **Step 4: Verify obsolete copy is gone and both pages match**

Run:

```bash
rg -n 'AgenticRL训练框架|面向大模型智能体训练的数据自动化收集|Step-level credit assignment|交互轨迹质量—模型能力增益关联建模' index.html research-tracks/index.html
git diff --check -- index.html research-tracks/index.html docs/superpowers/plans/2026-07-17-agenticrl-card-copy.md
```

Expected: `rg` exits 1 with no matches; `git diff --check` exits 0 with no output.

- [x] **Step 5: Stage only the intended files and inspect the staged diff**

Run:

```bash
git add -- index.html research-tracks/index.html docs/superpowers/plans/2026-07-17-agenticrl-card-copy.md
git diff --cached --name-only
git diff --cached --check
```

Expected staged files:

```text
docs/superpowers/plans/2026-07-17-agenticrl-card-copy.md
index.html
research-tracks/index.html
```

- [ ] **Step 6: Commit the synchronized copy update**

Run:

```bash
git commit -m "Update AgenticRL research module copy"
```

Expected: one commit containing only the plan and two HTML files.

- [ ] **Step 7: Push and verify remote parity**

Run:

```bash
git fetch origin
git rev-list --left-right --count HEAD...origin/main
git push origin main
git fetch origin
git rev-list --left-right --count HEAD...origin/main
```

Expected: before push, the local branch is ahead with no incoming commits; after push, the final count is `0 0`.
