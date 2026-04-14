---
title: 'Agent Harness 的三次跃迁'
description: '从 Claude Code 到 OpenClaw 到 Hermes Agent——Agent Harness 的三次代际跃迁，是同一个设计思想在不同维度的展开。'
pubDate: 2026-04-14
heroImage: ''
tags: ['AI', 'Hermes Agent', 'Claude Code', '架构']
---

# Agent Harness 的三次跃迁：从 Claude Code 到 OpenClaw 到 Hermes Agent

如果你仔细观察过去一年AI Agent领域的暗线，会发现一条清晰的演进脉络：Agent Harness——也就是包裹在大语言模型外面的"骨架"——正在经历三次代际跃迁。

这不是三家公司的竞争叙事。这是同一个设计思想在不同维度的展开。

## 第一代：Claude Code——把模型装进终端

2025年，Anthropic发布了Claude Code。表面上它是一个编程助手，但实质上它定义了第一代Agent Harness的基本范式：

**模型 + 工具循环 + 上下文管理。**

核心结构极其简洁：一个循环里，模型思考、调用工具、观察结果、继续思考，直到任务完成。工具包括文件读写、终端执行、代码搜索。上下文通过CLAUDE.md文件注入项目知识，通过memory系统跨会话记忆用户偏好。

这个范式的关键洞察是：**模型本身不是产品，模型外面的那层"壳"才是。** 裸模型只会说话。加上工具循环，它才能做事。加上上下文管理，它才能在特定场景里做事。加上记忆，它才能为特定的"你"做事。

Claude Code证明了三件事：

1. **工具循环是Agent的充分条件。** 不需要复杂的规划算法，不需要知识图谱，一个精心设计的工具循环加上一个足够强的模型，就能解决大部分实际问题。
2. **上下文即人格。** 同一个模型，在不同项目的CLAUDE.md引导下，行为完全不同。这不是prompt engineering的技巧，这是Agent Harness的设计原则。
3. **终端是最好的起点。** 开发者是早期用户，终端是他们最自然的工作环境，代码是模型最容易验证的工作产物。

但Claude Code的局限同样清晰：它绑定在终端里，绑定在编程场景里，绑定在单会话里。你关掉终端，Agent就消失了。

## 第二代：OpenClaw——让Agent长出神经系统

OpenClaw的出现，回答了一个Claude Code没有触及的问题：**如果Agent不只是编程工具，而是你的个人助理，它需要什么？**

答案是：它需要一个神经系统。

OpenClaw的核心创新是**Gateway**——一个WebSocket控制平面。所有通道（WhatsApp、Telegram、Slack、Discord、Signal、iMessage、WeChat等24+平台）都汇入这个Gateway，由它统一管理会话、工具、事件和技能分发。

```
所有消息平台 ──→ Gateway（控制平面）──→ Agent
                                        ├── CLI
                                        ├── WebChat
                                        ├── macOS/iOS/Android App
                                        └── 子Agent路由
```

这个架构带来了三个质变：

**多通道不再是"适配"，而是"路由"。** 你在WhatsApp上跟Agent说"帮我查一下明天的会议"，它在Telegram上回复你结果，同时通过邮件发送摘要。Agent不再绑定在一个入口，它活在你的整个通信网络里。

**多Agent不再是"多开"，而是"隔离"。** OpenClaw支持将不同的通道/联系人路由到隔离的Agent工作区，每个Agent有独立的人格（SOUL.md）、技能、记忆和工作空间。你的工作Agent和你的私人Agent可以完全不同。

**安全不再是"信任"，而是"策略"。** 默认DM配对（未知发件人需要配对码）、Docker沙箱隔离非主会话、工具白名单/黑名单。OpenClaw连接的是真实的消息平台，安全是第一公民。

OpenClaw还引入了几个Claude Code没有的概念：

- **Skills平台（ClawHub）**：Agent可以搜索、安装、使用社区技能。技能不是代码插件，是Markdown描述的任务模板。
- **Voice Wake + Talk Mode**：语音唤醒和持续对话。macOS/iOS支持wake word，Android支持持续语音。
- **Canvas / A2UI**：Agent驱动的可视化工作区，Agent可以推送UI给你。
- **Cron调度**：定时任务，Agent在你不说话时也能工作。
- **Companion Apps**：macOS菜单栏应用、iOS/Android节点应用，让Agent延伸到设备层面。

OpenClaw的定位是"Your own personal AI assistant"——强调personal。它不追求通用智能，追求的是**深度个人化**。你用它越久，它越了解你的通信习惯、工作流程、偏好。

但OpenClaw有一个根本性的未解问题：**这些"了解"是被动的。** Agent会记住你的设置，会按照SOUL.md行动，会使用你安装的技能——但它不会主动学习。你用了一年和用了一天，Agent的能力边界没有本质变化。

## 第三代：Hermes Agent——让Agent开始生长

Hermes Agent的出现，直指这个痛点。它的官网写着一句话：**"The agent that grows with you."**

这不是修辞。Hermes Agent在OpenClaw奠定的架构基础上，加上了第四个维度：**自我改进闭环（self-improvement loop）。**

这个闭环包含四个层次：

**第一层：自动技能生成。** 你让Agent完成一个复杂任务——比如"把这个CSV数据清洗后导入PostgreSQL，生成可视化报告"——它完成之后会自动把解决过程提炼成一个可复用的技能。下次遇到类似任务，直接调用。

**第二层：技能使用中优化。** 技能不是写好就完事了。每次调用后Agent会评估效果，自动改进技能描述和执行步骤。这是一个持续的过程。

**第三层：跨会话记忆召回。** 通过FTS5全文搜索 + LLM摘要，Hermes Agent能搜索自己过去所有对话记录。它不只是"记住"上次聊了什么，它能从历史经验中检索相关解决方案。

**第四层：用户模型构建。** 通过Honcho dialectic系统，Agent在持续建立对你的深层理解——不是表层的"你喜欢Python"，而是"你写代码时偏好先写测试"、"你处理数据时习惯先用pandas探索再决定schema"。

这四层加在一起，构成了一个真正意义上的**经验积累系统**。区别于OpenClaw的被动记忆，Hermes Agent的经验是主动提炼的、可操作的、持续进化的。

更值得关注的是Hermes Agent的self-evolution项目——使用DSPy + GEPA（Genetic-Pareto Prompt Evolution，遗传帕累托提示进化）来自动优化技能和提示。这意味着Agent的进化不只是线性的"越来越好"，而是种群级别的多目标优化——在速度、质量、成本之间寻找帕累托最优。

Hermes Agent还继承了OpenClaw的多数优点并做了增强：

- 同样支持多通道（Telegram、Discord、Slack等），同样有Gateway架构
- 六种终端后端（本地、Docker、SSH、Daytona、Singularity、Modal），Serverless选项让空闲时几乎不花钱
- 子Agent委派和并行执行，支持Python RPC脚本实现零上下文成本的多步流水线
- MCP集成，可以连接任何MCP服务器扩展能力
- 甚至提供了从OpenClaw的一键迁移工具（`hermes claw migrate`）——承认了继承关系

## 三次跃迁的本质

把三代放在一起看，演进的本质是什么？

| 维度 | Claude Code | OpenClaw | Hermes Agent |
|------|------------|----------|-------------|
| **核心问题** | 模型怎么做事？ | Agent怎么无处不在？ | Agent怎么越来越好？ |
| **设计隐喻** | 终端里的工匠 | 神经系统 | 生命体 |
| **工具循环** | 有 | 有 | 有 |
| **多通道** | 无 | 24+平台 | 多平台 + Gateway |
| **记忆** | 文件级 | 会话级 | 经验级（FTS5 + LLM摘要） |
| **技能** | 无 | ClawHub（社区分发） | 自动生成 + 自我优化 |
| **用户建模** | CLAUDE.md | SOUL.md | Honcho dialectic |
| **进化能力** | 无 | 无 | DSPy + GEPA |
| **安全** | 本地信任 | DM配对 + 沙箱 | 6种隔离后端 |
| **成本** | 按Token | 按Token + 设备 | Serverless空闲免费 |

每一次跃迁都解决了一个核心问题，然后暴露出下一个问题：

1. Claude Code证明了**工具循环**是Agent的基石。但它绑定在单一场景里。
2. OpenClaw证明了**多通道 + Gateway**能让Agent脱离场景限制，活在你的通信网络里。但Agent的能力是静态的。
3. Hermes Agent证明了**自我改进闭环**能让Agent从静态工具变成动态协作者。但它才刚刚开始。

## 下一个问题是什么？

如果这个演进脉络继续下去，第四代Agent Harness需要解决什么？

我的猜测是：**Agent之间的协作网络。**

当前的演进路径始终是"一个Agent + 一个用户"。Hermes Agent有子Agent委派，但那是主从关系，不是对等协作。真正的下一步可能是：

- Agent之间共享技能和经验（不是通过ClawHub这样的集中式市场，而是通过P2P协议）
- Agent之间协商和分工（不是"你帮我做这个"，而是"我们分头做，然后合并"）
- Agent群体中出现专业化分工（有的擅长搜索，有的擅长编程，有的擅长数据分析，它们自发组成临时团队）

这听起来像科幻。但回顾这条脉络——从Claude Code的终端循环到Hermes Agent的自我进化——每一次跃迁在发生之前，听起来都像科幻。

Agent Harness的故事，才刚刚开始。
