# Autonomous Learning Subpage Design

Date: 2026-07-13
Status: Approved design, pending written-spec review

## Objective

Update `autonomous-learning/index.html` so its first viewport follows the content hierarchy and visual rhythm of the approved homepage screenshot, while keeping a concise set of useful research-mechanism sections below the fold.

The page should feel like a focused research subpage of the existing USTC-AGI site, not a duplicate marketing page or a separate visual system.

## Scope

- Change only `autonomous-learning/index.html` during implementation.
- Keep the page as a dependency-free static HTML document with inline CSS and minimal JavaScript.
- Reuse the site's restrained red, white, black, and light-gray palette.
- Do not modify the homepage or `research-tracks/index.html` as part of this task.
- Do not add new bitmap, SVG, font, or framework dependencies.

## Information Architecture

### 1. Global Header and Navigation

Use a compact site header rather than the current large decorative hero. The header identifies the page as part of `USTC-AGI LLMs and Agentic AI` and keeps the research-page title visible without pushing the core content below the first viewport.

The sticky navigation contains these anchors:

- 概览
- 自主学习
- AgenticRL
- 研究机制
- 持续进化

### 2. First-Viewport Overview

The first content block is a full-width white research card with a thin dark-to-red top accent. It contains:

- Title: `人类学习启发的大模型自主学习`
- Description: `探究大模型从模型及人类反馈中进行自主交互学习的机制及方法，以实现能力持续提升。`
- Three equal-width cards on desktop and one column on mobile:
  - `环境探索学习`
  - `同行模型学习`
  - `人类反馈学习`

The three descriptions and icons match the approved homepage screenshot exactly. A bottom action row contains `查看主页 →`, linking back to `../#research-tracks` so the subpage does not link to itself.

### 3. AgenticRL Module Row

Immediately below the overview, show three equal-height cards in one desktop row:

1. `AgenticRL训练框架`
2. `AgenticRL优化算法`
3. `AgenticRL数据质量`

Each card follows the screenshot structure:

- Thin top accent
- Title and concise description
- Three bordered metadata rows
- Bottom-aligned action row

Links:

- Training framework: `查看主页 →` to `../agent-training/`; `Agent-R1` to `../agent-r1/`
- Optimization algorithm: `查看主页 →` to `../agentic-rl/`; `StepPO` to `../steppo/`
- Data quality: `查看主页 →` to `../#research-tracks`; `Claw-R1` to `../claw-r1/`

### 4. Concise Research Mechanisms

Below the screenshot-aligned content, keep one compact section named `自主学习研究机制`.

Present a four-stage closed loop:

1. 多源反馈：环境、同行模型与人类反馈
2. 轨迹形成：推理、行动、偏好与纠错记录
3. 优化学习：奖励建模、信用分配与策略优化
4. 能力增益：任务求解、知识迁移与持续提升

This replaces the current repeated Training-based explanation, keyword cloud, statistics, standalone development-platform section, and large layered stack.

### 5. Concise Continuous-Evolution Section

Keep one compact section named `人类反馈与环境交互驱动的大模型持续进化` because the group homepage also routes this research direction to the same subpage.

It contains two equal cards:

- `人类反馈建模与主动对齐学习`
- `经验记忆交互`

The content follows the latest homepage wording. The removed `科学知识交互` card and the old three-part Training-free framing do not return.

## Visual Rules

- Main content width: approximately `1180px`, constrained responsively.
- Page background: near-white neutral gray; repeated item cards remain white or very lightly tinted.
- Card radius: no more than `8px`.
- Accent: thin dark-to-red line at the top of major cards.
- Desktop grids: three columns for the overview and AgenticRL modules; two columns for continuous evolution.
- Card content uses flex layout so action rows align at the bottom despite different text lengths.
- Text is left-aligned. Chinese body copy uses comfortable line height without forced full justification.
- Avoid decorative gradients, oversized hero typography, nested cards, pill-heavy tags, and hover movement that shifts layout.
- Preserve visible focus states and sufficient color contrast for links and buttons.

## Responsive Behavior

- At widths below `900px`, the AgenticRL row may become two columns before collapsing.
- At widths below `720px`, all content grids become one column.
- Navigation remains horizontally scrollable on narrow screens.
- Buttons wrap without clipping; long Chinese titles and English terms must not overflow.
- No horizontal page scrolling at desktop or mobile widths.

## Interaction and Failure Handling

- Anchor navigation uses native links and smooth scrolling.
- The page has no data fetching and therefore no loading or error state.
- All project links must resolve to existing local HTML routes before completion.
- Remove the current click-to-refresh behavior from the decorative hero because the new header is navigational, not an interactive control.

## Verification

Implementation is complete only when all of the following are verified:

- Exact required titles and screenshot copy exist in the rendered page.
- Old `Training-based`, `Training-free`, `开发平台`, `科学知识交互`, and layered-stack sections are absent from visible content.
- Every declared internal link points to an existing route.
- Static HTML checks and `git diff --check` pass.
- Desktop screenshots at approximately `1440x1000` show the first two content groups in the approved order with aligned cards.
- Mobile screenshots at approximately `390x844` show a single-column layout with no clipping, overlap, or horizontal overflow.
- The browser console contains no page errors.

## Non-Goals

- Redesigning the rest of the group homepage.
- Creating new AgenticRL project detail pages.
- Adding animations, analytics, backend services, or a build framework.
- Publishing or pushing the implementation before the user reviews the result.
