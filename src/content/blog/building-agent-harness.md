---
title: '造一个 Agent Harness：我的构建心得'
description: '从零开始构建 neonity-agent 的全过程——一个轻量级 AI Agent 框架的设计决策、踩坑记录和技术复盘。'
pubDate: 2026-05-06
heroImage: ''
tags: ['AI', 'Agent', '架构', 'neonity-agent', '构建心得']
---

# 造一个 Agent Harness：我的构建心得

## 起因

我造了一个 Agent 框架，叫 neonity-agent。

说"造"可能有点正式。准确说，是我一边读 pi-mono 的源码、一边照着 REACT 论文、一边自己动手，花了几个星期，从零搭起来的一个东西。5700 行 TypeScript，不多，但每一行都经过了思考。

这篇文章是我对这个过程的复盘。不是教程，不是文档，是一个开发者在造完轮子之后，试图说清楚"为什么这么造"。

## 第一个决定：REACT 循环是一切的骨架

几乎所有 Agent 框架的核心都是同一个东西：一个循环。模型思考，调用工具，观察结果，继续思考，直到任务完成或者预算用完。

neonity-agent 也不例外。`AgentLoop` 的 `run()` 方法就是对这个循环的直接实现：

```
while (iterations < maxIterations) {
  1. 检查上下文，必要时截断
  2. 调用 LLM，流式接收响应
  3. 如果有工具调用 → 并行执行 → 把结果喂回去 → 继续循环
  4. 如果没有工具调用 → Agent 说完了 → 退出
}
```

这个结构简单到几乎不需要解释。但"简单"恰恰是最难的设计决策。

我在这里犯过一个错误：最早版本里，我试图在循环里加一层"规划器"——让模型先输出一个计划，再按计划执行。听起来很优雅，实践中完全多余。一个足够强的模型在工具循环里自然会产生规划和反思行为，不需要额外的框架层来强迫它。REACT 论文的核心洞察就是这个：**推理和行动不需要分离，它们在同一个循环里涌现。**

所以最终我砍掉了规划器，回归最朴素的循环。砍完之后，整个系统反而更可靠了。

## 第二个决定：Provider 是一个接口，不是一个 SDK

neonity-agent 支持 5 个提供商：OpenAI、Anthropic、Gemini、GLM、MiniMax。但核心代码里没有任何一个 SDK 的具体逻辑。

所有提供商都实现同一个接口——`ProviderTransport`，只有一个方法：`stream()`。输入是标准化的消息格式，输出是标准化的 `AsyncIterable<StreamEvent>`。

```
ProviderTransport {
  name: string
  stream(options): AsyncIterable<StreamEvent>
}
```

这意味着：
- 加一个新提供商，只需要写一个 transport 类，注册到 registry 里
- 切换模型不需要改任何业务逻辑
- 测试时可以 mock 整个 LLM 层

这个决定做对了。后来我加 GLM 和 MiniMax 的时候，因为它们走 OpenAI 兼容协议，直接继承 `OpenAITransport` 改个 `baseUrl` 就行了。成本几乎为零。

但这里也有一个微妙的设计取舍：消息格式转换。OpenAI、Anthropic、Gemini 三家的消息格式各不相同。我把所有转换逻辑集中到了 `helpers.ts` 里——`toOpenAIMessages()`、`toAnthropicMessages()`、`toGeminiMessages()`。这导致 helpers 文件比较厚，但换来了一个巨大的好处：**错误只会发生在一个地方**。如果消息格式有问题，只可能是 helpers 的问题，不用去五个 transport 里翻。

## 第三个决定：工具是注入的，不是内置的

很多 Agent 框架把工具和循环绑死在一起。neonity-agent 没有这样做。

`AgentLoop` 的构造函数接收一个 `tools` 数组。每个工具实现 `ToolHandler` 接口——一个 `definition`（JSON Schema）加一个 `execute()` 方法。循环本身不知道也不关心工具做了什么，它只负责：

1. 把工具定义传给 LLM
2. 收到工具调用后，找到对应的 handler，执行
3. 把结果喂回去

```
ToolHandler {
  definition: { name, description, parameters }
  execute(args): Promise<string>
}
```

工具是**并行执行**的。如果 LLM 一次返回 3 个工具调用，它们会被 `Promise.all` 同时执行。这是另一个早期的设计决策——串行更安全，但并行更自然。LLM 已经决定了这些调用之间没有依赖关系（否则它不会同时返回），信任它的判断就好。

内置的工具集很克制：terminal、read_file、write_file、git 系列、ls、memory 系列、soul 系列。每个都是因为"没有这个工具 Agent 就没法干活"才加的。没有为了"看起来功能多"而塞进去的东西。

## 第四个决定：SOUL.md 和 MEMORY.md 的双轨人格

这是整个项目里我最满意的设计。

大多数 Agent 的"个性"要么硬编码在 system prompt 里，要么完全没有。neonity-agent 把它拆成了两个独立的持久化系统：

**SOUL.md** — Agent 的身份和人格。第一人称。"我是一个友好的助手"、"我喜欢简洁的回答"。放在 System Prompt 的顶部，优先级最高。变化频率低，像性格一样稳定。

**MEMORY.md** — 关于世界的事实。客观描述。"用户使用 pnpm"、"项目在 ~/neonity-agent"。放在 System Prompt 的底部。随时增删，像工作记忆一样灵活。

两套系统有各自独立的工具（`soul_*` 和 `memory_*`），各自独立的文件存储，但共享同一个 `§` 分隔符格式。关键设计点：

- Agent 可以通过工具**自我修改** SOUL.md 和 MEMORY.md。修改后，system prompt 在下一轮对话前自动重建，立即生效。
- SOUL 在前、MEMORY 在后的注入顺序不是随意的——身份先于事实，就像一个人先知道"我是谁"，再知道"我知道什么"。

这个设计的灵感来自 Hermes Agent 的 SOUL.md 和 Claude Code 的 CLAUDE.md/MEMORY.md，但把两者合到一个框架里、并让它们可自我修改，是 neonity-agent 自己的做法。

## 第五个决定：上下文管理是生存问题

LLM 有上下文窗口限制。超出限制，API 报错，对话崩溃。这不是一个"优化"问题，这是一个"生存"问题。

neonity-agent 的做法是：**80% 阈值 + FIFO 截断**。

每次循环开始前，`ContextManager` 会估算当前消息的总 token 数。如果超过模型上下文窗口的 80%，就从最早的消息开始砍，直到回到安全线以下。

token 估算本身是个有意思的子问题。精确估算需要 tokenizer（比如 tiktoken），但引入 tokenizer 会增加依赖和启动时间。neonity-agent 用了一个启发式算法：中文字符按 0.5 token/char 计，英文按 0.25 token/char 计。准确度大约 80-90%，对于"该不该截断"这个二元决策来说已经够了。

FIFO（先进先出）是最粗暴的截断策略，也是最安全的。更聪明的策略比如"保留重要消息"需要重要性评分，而重要性评分本身就需要额外的 LLM 调用——为了省 token 而花 token，得不偿失。

## 第六个决定：成本路由是一个独立关注点

neonity-agent 有一个可选的 `--router` 模式，实现了基于 FrugalGPT 论文的成本感知路由：

```
用户查询 → 廉价模型分类复杂度（1-5分）
         → 分数 < 4 → 廉价模型回答
         → 分数 >= 4 → 昂贵模型回答
```

这个路由器是完全独立于主循环的。它不修改 AgentLoop，不修改 Provider，只是在外面包了一层决策。打开就生效，关掉就不存在。

这是一个设计原则的体现：**横切关注点应该是可插拔的，不是侵入的。** 成本优化不应该污染核心循环的代码。

## 回头看：什么做对了，什么做错了

**做对了的：**

- REACT 循环保持最简。没有规划器，没有记忆检索器，没有复杂的状态机。简单的东西不容易坏。
- Provider 抽象为一接口。后来加了两个提供商，成本接近零。
- SOUL/MEMORY 双轨系统。这让 Agent 有了真正的"自我认知"。
- 工具并行执行。信任 LLM 的判断，不人为串行化。
- 全程 TypeScript + ESM。类型安全在 Agent 框架里特别重要——你不想在运行时才发现工具参数格式错了。

**做错了的：**

- 早期花太多时间在规划器上，最后砍掉。应该更早回归简单。
- 没有从一开始就设计测试。Agent 框架的测试很难写（需要 mock LLM），但不写测试的代价是每次改动都提心吊胆。
- Token 估算的启发式算法可以更好。现在对混合语言的支持还行，但对代码块的处理偏粗糙。

## 造完之后，我对 Agent 的新理解

造轮子最大的价值不是轮子本身，是造轮子的过程中你理解了什么。

我理解了三件事：

**第一，Agent 框架的本质是胶水。** LLM 是大脑，工具是手脚，框架只是把它们粘在一起的那层薄薄的胶水。胶水不需要复杂，需要透明。最好的框架是让你感觉不到它存在的框架。

**第二，持久化是 Agent 和 ChatBot 的分界线。** ChatBot 每次对话从零开始。Agent 记得你是谁、它自己是谁、上次聊了什么。SOUL.md 和 MEMORY.md 看起来只是两个文件，但它们改变了一个根本性的东西——Agent 不再是无状态的。它有了时间维度。

**第三，好的 Agent 框架不是让 Agent 更强，是让 Agent 更容易被理解。** 5700 行代码，一个开发者用一个下午就能读完。这不是偷懒，这是设计目标。如果有人想基于 neonity-agent 做自己的修改，他应该能在一天之内理解整个系统。复杂度应该住在 LLM 里，不该住在框架里。

## 下一步

neonity-agent 还在演进。接下来我想做几件事：

- **技能系统**——像 Hermes Agent 那样，自动把任务解决过程提炼成可复用的技能
- **多 Agent 协作**——子 Agent 委派和结果聚合
- **更好的测试基础设施**——LLM mock 层 + 回放测试

但不管加什么，核心原则不变：**保持简单，保持透明，让复杂度住在该住的地方。**

---

*neonity-agent 是一个开源项目，代码在 [GitHub](https://github.com/neonity2020/neonity-agent)。5700 行 TypeScript，MIT 协议。欢迎来玩。*
