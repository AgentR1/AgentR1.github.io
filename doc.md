## OpenClaw 之后，Agentic RL有了新训练范式

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=OTIyYmYzZTYwNjRkZjI4OWVmNWNiZTA5NzM3NWYwZDBfVG9uamlDT1psd0hCcFNvekZUaHlTbHRsbHNhRW9wOEpfVG9rZW46SHBpeGJsdXhab3E3ZFF4V21ZbGNQVnV5bjRnXzE3NzI1OTUwNzU6MTc3MjU5ODY3NV9WNA)

近年来，大模型技术的发展正在推动 AI 从 "回答问题" 逐渐迈向 "执行任务"。在这一转变过程中，一个新的研究方向正在快速兴起：Agentic AI。在 Agentic AI 的世界里，大模型不再只是一个文本生成器，而是一个通过调用工具、环境交互、多步推理来执行复杂任务的智能体。

然而，当 Agent 能够在真实环境中运行时，一个新的问题随之出现：我们应该如何训练这样的 Agent？

中国科大认知智能全国重点实验室提出的 Claw-R1 项目，正是针对这一问题提出的一种全新的强化学习训练框架。它尝试将 前沿的Agent Runtime（比如OpenClaw） 与强化学习训练框架深度结合，为 Agentic AI 提供一个新的训练基础设施。

1. ## 项目背景

### 大模型强化学习的三次范式演进

大模型强化学习正在经历一次重要转变：从**人类偏好学习（RLHF）**，到**任务结果学习（RLVR）**，再到**环境交互学习（Runtime RL）**。

| 阶段       | 目标                     | 奖励来源             |
| ---------- | ------------------------ | -------------------- |
| RLHF       | 生成更符合人类偏好的文本 | Human preference     |
| RLVR       | 完成可验证任务           | Verifiable reward    |
| Runtime RL | 在真实环境中行动         | Environment feedback |

- **第一阶段：Preference-based RL**，让模型生成更符合人类偏好的回答（代表工作：InstructGPT、RLHF）。
- **第二阶段：Task-verifiable RL**，训练模型完成可验证任务（代表工作：VERL、**Agent-R1**）。
- **第三阶段：Runtime-interactive RL**，让模型在真实 Agent Runtime 中学习行为策略（本项目介绍的Claw-R1）。

总的趋势：**AI 的奖励来源正在越来越接近真实世界。**

### Agentic RL 的困境：RLVR 的关键缺口

尽管 RLVR 已经能够支持 **多轮交互学习**，但仍然存在一个关键问题：

**Agent 运行环境并不真实。**

目前大多数 RLVR 框架依赖的都是研究导向的模拟环境，例如：

- coding benchmark（代码生成评测）
- reasoning tasks（数学推理、逻辑推断）
- synthetic environment（人工构造的任务沙盒）

这些都是 **特定任务的训练场**，而非真实的 Agent Runtime。模型可以学会推理和决策，但它从未真正运行在现实工具系统中。

随着 Agent 技术的成熟，这一缺口愈发明显：**我们需要一个真实可用的 runtime 环境作为训练基础。**

### OpenClaw 的崛起：Agent Runtime 的新基础设施

OpenClaw 是一款开源的个人 AI Agent 操作系统，采用 MIT 协议、TypeScript 实现，遵循本地优先原则。自发布以来，它在 8 周内获得超过 236,000 个 GitHub Star，成为开源历史上增长最快的项目之一。

其核心架构采用 Hub-and-Spoke 设计：15+ 主流消息平台通过统一 Gateway 接入，驱动中央的 Pi Agent Runtime 执行任务。两项关键创新使其真正具备生产可用性——Lane Queue 机制通过串行执行消除并发竞态条件，三层混合记忆系统则为 Agent 提供稳定的上下文管理能力。

OpenClaw 因此成为第一个可以在真实消息环境中自主、持续运行的 Agent 平台，为 Agentic RL 提供了此前从未有过的真实 Runtime 基础。

2. ## 项目动机：如何训练适配 OpenClaw 的模型？

当 OpenClaw 这样的 Agent Runtime 出现后，一个新的问题随之而来：

**如何训练能够在 OpenClaw 这样的 runtime 中高效运行的模型？**

传统 RLVR 框架虽然可以训练 Agent，但它们通常：

- 没有真实 runtime
- 没有复杂工具系统
- 没有完整任务环境

这意味着：

**模型的训练环境与真实 Agent Runtime 之间存在明显鸿沟。**

如果模型是在简化环境中训练的，那么当它运行在真实 Agent 系统中时，往往会出现：

- 工具调用混乱
- 规划能力不足
- 长任务不稳定

因此，需要一种新的训练框架：

**能够直接在 Agent Runtime 上进行强化学习训练。**

3. ## Claw-R1：连接 Agent Runtime 与 RLVR 的桥梁

Claw-R1（OpenClaw-RL）的核心目标，就是解决这一问题。

它尝试构建一个完整系统：

**Agent Runtime + RLVR Training Loop**

在这个系统中：

Agent 在真实环境中执行任务，而训练系统利用任务结果进行强化学习更新。

整体系统可以分为三个部分：

1. **Agent Runtime**：OpenClaw 提供的真实运行环境，Agent 在此调用工具、与用户交互、执行多步任务
2. **Interaction Data Pool**：收集 Agent 在真实环境中的交互轨迹，作为强化学习的训练数据来源
3. **RLVR Training Engine**：基于真实轨迹数据，对模型进行强化学习更新，形成闭环训练

### 框架特色介绍

Claw-R1 引入 **Middleware 中间层**（Gateway Server + DataPool），作为 Agent 侧与训练侧之间的唯一桥梁。训练框架为白盒与黑盒智能体提供 **OpenAI 兼容的接口**，并通过 HTTP 通信，支持三种运行模式：白盒离线、黑盒离线、黑盒在线服务。Agent 与训练彻底解耦，实现真正的「双向适应」。

![img](https://my.feishu.cn/space/api/box/stream/download/asynccode/?code=YmRhZjkxMjk3ZjY5ZjI4NzhkOTdmYmYyNzZmYjY3MjBfbFVVYlp4Q3NLNXJiVnZiRzhseHcxWkEyUEt5bTlsUFJfVG9rZW46TmplSGJjYWpxb0M3Nmh4OVM5Y2NtaHdQbnBjXzE3NzI1OTYzNDY6MTc3MjU5OTk0Nl9WNA)

- **训练与 Rollout 异步**：框架内 Rollout Engine（负责生成）与 Training Engine（负责训练）异步运行。OpenClaw 通过 Gateway 调用 LLM 时，生成数据流入 DataPool，Training Engine 从 DataPool 拉取批次更新模型，二者互不阻塞。
- **Agent 与训练解耦**：OpenClaw 在 Mac Mini 上提供服务，模型训练在高性能服务器上进行。Agent 运行与 RL 训练完全独立，无需预置数据集，边服务边训练。
- **零代码侵入**：OpenClaw 只需将调用 LLM 的 `base_url` 指向 Claw-R1 的 Gateway，即可接入训练框架。无需修改 OpenClaw 的 Agent 逻辑，框架自动采集交互数据并训练。

4. ## 为什么 Claw-R1 很重要

Claw-R1 的意义在于：

它为 **Agent Runtime 时代的强化学习训练**提供了一个新的基础设施。

如果说：

- **OpenClaw** 解决的是 Agent 的 **运行环境问题**

那么：

- **Claw-R1** 解决的是 Agent 的 **训练框架问题**

两者结合，正是大模型强化学习第三阶段的核心体现：

**Runtime RL —— 以真实环境反馈为奖励，让模型学会在现实中行动**

在这种范式下，AI 不再只是学习生成文本，也不再只是完成孤立的可验证任务，而是学习：

**如何在真实 Agent Runtime 中持续、稳定地完成复杂任务。**

5. ## 总结

随着 Agent 技术的发展，大模型系统正在逐渐演化为：

**"推理 + 工具 + 环境 + 学习" 的闭环系统。**

在这样的系统中：

- Agent Runtime 提供 **执行环境**
- RLVR 提供 **学习机制**
- Claw-R1 提供 **训练基础设施**

这些技术的结合，很可能会成为下一代 **Agentic AI 系统的基础架构**。

而 Claw-R1，正是这一方向上的一次重要探索。



### Reference:

- Agent-R1: Training Powerful LLM Agents with End-to-End Reinforcement Learning
- **Agent-R1**：中国科大认知全重实验室多轮交互强化学习训练框架（https://github.com/0russwest0/Agent-R1）

- **VERL**：字节跳动开源的高性能 RLHF 训练框架（HybridFlow）
- **Agent Lightning**：面向 Agentic 场景的分布式 RL 训练基础设施