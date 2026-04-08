# CastClaw 用户文档站规划

## 技术方案

**单 HTML 文件 + 侧边栏导航**，与现有项目风格一致，维护简单。

- 路径：`cast-claw-v2/docs/index.html`
- 配色延续橙色主题 `#d35400`，保持品牌一致性
- 布局：左侧固定侧边栏（240px）+ 右侧内容区（max-width 760px）

---

## 文档结构（侧边栏目录）

```
📖 CastClaw 文档
│
├── 🚀 快速开始
│   ├── 安装与环境配置
│   ├── 第一个预测任务（5 分钟上手）
│   └── CLI 基础操作
│
├── 🧠 核心概念
│   ├── 系统架构概览
│   ├── 三智能体协同（Planner / Forecaster / Critic）
│   ├── Agentic Workflow 全流程
│
├── 👤 人在回路
│   ├── 什么是人在回路暂停
│   ├── 技能审核：如何介入
│   └── 结果确认与干预时机
│
├── 🔌 插件工具箱
│   ├── CastSense：数据诊断
│   ├── CastFeat：特征构建
│   └── CastZoo：模型编排
│
├── 🗂️ Skill 系统
│   ├── Skill 是什么
│   ├── Skill 文件结构
│   ├── 如何审核与沉淀 Skill
│   └── /cast-creation 命令
│
├── ⚙️ 配置参考
│   ├── CAST.md 约束文件
│   ├── castclaw.json 参数
│   └── 模型接入（LLM 配置）
│
├── 🖥️ CLI 命令参考
│   ├── castclaw 启动选项
│   ├── 快捷键速查（Ctrl+1/2/3 等）
│   └── forecast_state / forecast_task 工具
│
├── 📚 使用示例
│   ├── 电力负荷预测（load.csv）
│   ├── 光伏发电预测
│   ├── 金融时序预测
│
└── ❓ FAQ & 故障排查
    ├── 常见问题
    └── 环境问题排查
```

---

## 页面设计要点

| 元素 | 方案 |
|------|------|
| 布局 | 左侧固定侧边栏（240px）+ 右侧内容区（max-width 760px） |
| 导航 | 侧边栏分组折叠，当前节高亮，顶部面包屑 |
| 内容 | Markdown 风格排版：标题层级、代码块高亮、callout 提示框 |
| 搜索 | 简单的客户端全文搜索（`Ctrl+K` 唤起） |
| 右侧 | 当前页大纲（On This Page），快速跳转 |
| 移动端 | 汉堡菜单，侧边栏抽屉式 |

---

## 各章节内容说明

### 🚀 快速开始

#### 安装与环境配置
- 前置依赖：Bun ≥ 1.3.11、Python ≥ 3.10 + uv、API Key 配置
- 安装命令：`npm install -g castclaw`
- 验证安装：`castclaw --version` 与 Python 后端检查
- LLM 配置：环境变量设置（Anthropic / OpenAI / Google / DeepSeek 等）

#### 第一个预测任务（5 分钟上手）
- 下载样例数据集 `load.csv`（TIMESTAMP / LOAD 字段）
- 启动 CLI：`castclaw`
- 在 Planner 标签页输入任务描述示例
- 走通完整流程：初始化 → 分析 → 技能审核 → 迭代 → 报告

#### CLI 基础操作
- 快捷键速查表（`Ctrl+1/2/3` 切换智能体等）
- 标签页说明：Planner / Forecaster / Critic
- 任务状态查看与中断恢复

---

### 🧠 核心概念

#### 系统架构概览
- 四层架构图：CastRuntime → CastSkill → Plugin Ecosystem → TimeEmbed
- 各层职责说明
- 能力调度链：User Task → CastRuntime → CastSkill → Plugins → Reflection

#### 三智能体协同
| 智能体 | 职责 | 关键行为 |
|--------|------|----------|
| Planner | 任务定义、数据诊断、阶段编排 | 并发双轨分析、生成技能文件 |
| Forecaster | 迭代实验循环 | 选配置 → 训练 → 反思 → 人在回路 |
| Critic | 结果聚合与报告生成 | 性能分解、可视化、final-report |

#### Agentic Workflow 全流程（5 阶段）
1. **初始化（Init）**：冻结 task.json，创建 `.forecast/` 目录
2. **预测前分析（Pre-forecast Analysis）**：双轨并发（定性 WebSearch + 定量 CastSense）
3. **技能审核（Skill Audit）**：生成 2–4 个技能文件，人类确认后进入实验
4. **预测迭代（Forecasting）**：读历史 → 选配置 → CastFeat → CastZoo → 反思 → 人在回路
5. **后置报告（Post-forecast Report）**：Critic 生成 `final-report.md`

---

### 👤 人在回路

#### 三类人类介入节点
1. **任务设定确认**：目标列、时间列、预测步长、评估指标、资源约束
2. **技能策略审核**：模型族选择、参数搜索空间、风险警告确认
3. **实验停滞干预**：连续无改善时暂停，注入领域知识后重置计数器继续

#### 如何高效审核技能文件
- 关注适用条件与数据特征匹配度
- 检查参数搜索空间是否合理
- 确认风险警告中的已知问题

---

### 🔌 插件工具箱

#### CastSense：时序数据诊断
- 功能：趋势分析、季节性/周期性检测、非平稳性识别、分布漂移检测、异常识别
- 输出：结构化 knowledge，驱动后续技能检索与策略生成

#### CastFeat：特征构建与表示生成
- 功能：lag/rolling 特征、统计特征、频域与多尺度表示、patch/token 构建、embedding 生成
- 输出：model-ready representation

#### CastZoo：模型编排与调用
- 支持模型族：统计（ARIMA、ETS、Theta）、机器学习、深度学习（Informer、PatchTST 等）、基础模型（Chronos、TimesFM、Moirai）
- 支持策略：ensemble、pipeline、coarse-to-fine

---

### 🗂️ Skill 系统

#### Skill 文件结构（YAML）
```yaml
name: deep_learning_periodic
applicable_conditions:
  - 强季节性数据
  - 序列长度 > 5000
model_family: deep_learning
models: [PatchTST, iTransformer]
search_space:
  learning_rate: [1e-4, 5e-4]
  patch_len: [16, 32, 64]
feature_template: patch_token
risks:
  - 数据量不足时过拟合风险高
domain_notes: ""
```

#### Skill 生命周期
1. Planner 基于预测前分析草拟 2–4 个候选 Skill
2. 人类审核确认（可编辑修改）
3. 沉淀进 `skills/` 库，后续任务复用
4. 随积累持续进化，相似任务启动更快

#### /cast-creation 命令
- 交互式生成 `CAST.md` 项目约束文件
- 可指定禁用模型、资源限制、评估偏好、领域说明

---

### ⚙️ 配置参考

#### CAST.md 约束文件字段
| 字段 | 说明 |
|------|------|
| `banned_models` | 禁用模型列表 |
| `max_experiments` | 最大实验次数 |
| `no_improve_threshold` | 触发人在回路的连续无改善阈值 |
| `eval_metric` | 评估指标偏好 |
| `domain_notes` | 领域背景说明（注入每个 Agent 上下文） |

#### castclaw.json 参数
```json
{
  "model": "anthropic/claude-sonnet-4-6",
  "light_model": "anthropic/claude-haiku-4-5",
  "max_experiments": 20,
  "no_improve_threshold": 5
}
```

#### 支持的 LLM 提供商（via Vercel AI SDK）
- **国际**：Anthropic Claude、OpenAI GPT、Google Gemini
- **国内**：DeepSeek、Qwen（通义千问）、GLM（智谱）
- **部署方式**：API 接入、自建推理服务、昇腾算力 API

---

### 🖥️ CLI 命令参考

#### 启动命令
```bash
castclaw                                    # 启动 CLI（当前目录）
castclaw --model anthropic/claude-sonnet-4-6  # 指定模型
castclaw --version                          # 查看版本
```

#### CLI 快捷键
| 快捷键 | 功能 |
|--------|------|
| `Ctrl+1` | 切换到 Planner |
| `Ctrl+2` | 切换到 Forecaster |
| `Ctrl+3` | 切换到 Critic |

#### forecast_state 工具（阶段控制）
- `forecast_state init`：初始化任务，创建 `.forecast/` 目录
- 阶段转换强制执行，不可跳过，确保流程可追溯

---

### 📚 使用示例

#### 电力负荷预测（使用 load.csv）
- 数据：`load.csv`（TIMESTAMP / LOAD，1 小时频率，约 1.5 万条样本）
- 数据特征：强日周期（24h）与周周期（168h），夏冬峰值明显
- 推荐 Skill 策略：deep_learning（PatchTST、iTransformer）+ foundation（Chronos）
- 完整 Planner 输入模板展示
- 预期 `.forecast/` 目录产物结构

#### 光伏发电预测
- 数据：GEFCom2014 Solar Track（3 Zone，小时级辐照与发电功率）
- 数据特征：强日周期、夜间恒零、受天气因素影响大、季节性显著
- 推荐 Skill 策略：statistical（Theta）+ foundation（TimesFM、Moirai）
- CastSense 诊断重点：夜间零值处理、云层遮蔽导致的突变识别
- 人在回路介入重点：天气异常日（阴雨连续）的人类标注与领域补充

#### 金融时序预测
- 数据特征：高波动、非平稳、对突发事件极敏感（财报、政策）
- 推荐 Skill 策略：statistical + foundation ensemble，避免过度依赖单一深度模型
- CastSense 诊断重点：分布漂移检测、结构性断点识别
- 人在回路介入重点：重大事件日期标注、风险警告人类确认

---

### ❓ FAQ & 故障排查

#### 常见问题
- Q：如何更换 LLM 提供商？→ 修改 `castclaw.json` 或环境变量
- Q：人在回路暂停后如何继续？→ 在 Forecaster 标签页输入反馈后回车
- Q：Skill 文件在哪里管理？→ `.forecast/skills/` 目录

#### 环境问题排查
- Bun 版本不足：升级至 ≥ 1.3.11
- Python 后端报错：`cd python && uv sync` 重新安装依赖
- API Key 未生效：确认环境变量已 export，或写入 `castclaw.json`

---

## 实现优先级

| 优先级 | 章节 | 原因 |
|--------|------|------|
| P0 | 快速开始 | 用户最先访问 |
| P0 | Agentic Workflow 全流程 | 核心使用逻辑 |
| P1 | 人在回路 | 差异化特色，需详细说明 |
| P1 | CLI 命令参考 | 工具查询高频 |
| P2 | 插件 & Skill 系统 | 进阶使用 |
| P2 | 使用示例 | 辅助理解 |
| P3 | FAQ & 故障排查 | 按需补充 |
