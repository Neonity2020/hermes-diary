---
title: '用 Claude Code 蒸馏一个 mini Claude Code'
description: '一个周末，一个终端，一个 AI 伙伴。记录我如何用 Claude Code 从零构建 neonity——一个迷你 AI 编程助手。'
pubDate: 2026-04-28
heroImage: '/images/distilling-mini-claude-code.jpg'
tags: ['AI', 'Claude Code', '编程', 'neonity']
---

> 一个周末，一个终端，一个 AI 伙伴。记录我如何用 Claude Code 从零构建 neonity——一个迷你 AI 编程助手。

---

## 缘起

Claude Code 用多了，脑子里自然冒出一个想法：**这玩意儿到底是怎么工作的？**

不是那种"看看文档"的浅层理解，而是——如果我亲自写一个，哪怕功能只有它的 10%，我也能彻底搞懂它的骨架。正好有个周末没安排，我打开终端，对 Claude Code 说了一句话：

> "帮我写一个 mini Claude Code，用 TypeScript，跑在终端里。支持多 LLM 提供商，有工具调用和流式输出。"

几轮迭代之后，**neonity** 诞生了。

这篇文章不是教你复刻 Claude Code（毕竟 Anthropic 几百个工程师做了两年），而是展示一种新的构建范式：**用 AI 编程助手去蒸馏另一个 AI 编程助手的核心骨架**。这是一种"元编程"的体验——你用 AI 写代码，而那段代码本身就是一个 AI。

---

## 蒸馏的是什么

Claude Code 的完整功能范围很广：代码生成、项目分析、Git 操作、安全审查、图片理解、MCP 生态等等。但它的核心骨架其实非常清晰，可以浓缩成这几个关键模块：

| 模块 | Claude Code 的能力 | neonity 的蒸馏版本 |
|------|-------------------|-------------------|
| **终端 REPL** | 交互式命令行界面 | ✅ readline + 斜杠命令 + Tab 补全 |
| **REACT Agent Loop** | 推理→行动→观察循环 | ✅ 最大 50 轮迭代，有工具调用 |
| **工具系统** | bash/read/write/edit/glob/grep | ✅ bash/read/write/edit + web-search + hn-top |
| **流式输出** | 实时 Markdown 渲染 | ✅ 行缓冲 Markdown 渲染器 |
| **多 Provider** | Claude 系列模型 | ✅ 6 个提供商，统一接口 |
| **Smart Router** | N/A（Claude Code 只用 Claude） | ✅ 成本分层 + 熔断 + 降级 |
| **上下文管理** | 自动压缩长对话 | ✅ 截断 + 摘要两种策略 |
| **技能系统** | 内置指令 + hooks | ✅ 运行时可切换 skill，持久化状态 |
| **长期记忆** | 项目级记忆 | ✅ Markdown 持久化 + 分类检索 |
| **会话管理** | 保存/恢复对话 | ✅ save/load/list/del |

看起来多，但 **neonity 的核心代码不到 5000 行 TypeScript**（不含 node_modules），全程由我和 Claude Code 协作完成，总共 7 个 commit，一个周末。

---

## 架构：6 层矩形，像剥洋葱

neonity 的架构极其扁平。从入口进去，每层只做一件事：

```
src/
├── index.ts              # 入口：组装各模块，启动 REPL
├── config.ts             # 环境变量 → 运行时配置
├── types.ts              # 所有接口和类型定义（不到 200 行）
│
├── agent/                # 【核心】Agent 循环 + 系统提示词 + 上下文管理
│   ├── agent.ts
│   ├── system-prompt.ts
│   ├── context-manager.ts
│   └── tokenizer.ts
│
├── provider/             # 【适配层】LLM 提供商适配器 + 智能路由
│   ├── provider.ts       #   统一的 Provider 接口
│   ├── factory.ts        #   工厂函数
│   ├── router.ts         #   Smart Router（成本分层、熔断、降级）
│   ├── anthropic.ts      #   Claude → Anthropic API
│   ├── openai-provider.ts #  GPT → OpenAI API
│   ├── deepseek-provider.ts
│   ├── gemini.ts
│   ├── minimax.ts
│   └── glm-provider.ts
│
├── tool/                 # 【手和脚】Agent 可调用的工具
│   ├── tool.ts           #   工具注册表
│   ├── bash-tool.ts      #   执行 shell 命令（30s 超时）
│   ├── read-tool.ts      #   读取文件
│   ├── write-tool.ts     #   写入文件
│   ├── edit-tool.ts      #   精确字符串替换
│   ├── web-search-tool.ts
│   └── hn-tool.ts
│
├── skill/                # 【可插拔能力】注入到系统提示词的能力模块
│   ├── skill.ts
│   └── builtin/
│       ├── code-reviewer.ts
│       ├── test-writer.ts
│       ├── git-committer.ts
│       └── doc-writer.ts
│
├── memory/               # 【记忆系统】长期持久化知识
│   ├── memory.ts
│   └── memory-tool.ts
│
└── cli/                  # 【用户界面】REPL + 流式输出 + Markdown 渲染
    ├── repl.ts
    ├── stream.ts
    ├── display.ts
    ├── markdown.ts
    └── session.ts
```

这种架构的美妙之处在于：**每一层都是独立可测的**。Agent 不关心 Provider 是 Anthropic 还是 DeepSeek，只要能 `chat()` 就行。Router 实现了和 Provider 一模一样的接口，Agent 甚至不知道自己在跟一个智能路由器对话。

---

## 核心：REACT Agent Loop

这是整个项目的灵魂。短短 90 行代码，翻译成人话就是：

```typescript
// 高度简化的 Agent Loop 伪代码
async reactLoop(callbacks) {
  for (let i = 0; i < maxIterations; i++) {
    // 1. 上下文窗口管理（截断或摘要）
    const managed = await contextManager.manage(
      history, systemPrompt, tools, model, provider
    );
    if (managed.wasManaged) history = managed.messages;

    // 2. 调用 LLM
    const response = await provider.chat(
      history, tools, callbacks, systemPrompt
    );
    history.push({ role: "assistant", content: response.content });

    // 3. 如果 LLM 完成了（没有工具调用），退出循环
    if (response.stopReason === "end_turn") return;

    // 4. 否则，执行工具调用，把结果喂回去
    if (response.stopReason === "tool_use") {
      const results = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          const result = await toolRegistry.execute(
            block.name, block.input
          );
          results.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        }
      }
      history.push({ role: "user", content: results });
    }
  }
}
```

这就是整个 **REACT**（Reasoning + Acting）模式在代码层面的全部。LLM 第一次响应可能说"我需要先读文件"，工具执行后返回文件内容，LLM 拿着结果重新推理——这就是 Claude Code 在终端里不断 `⟳ bash`、`⟳ read` 的背后机理。

### 上下文管理：当对话太长时

LLM 的上下文窗口是有上限的。多轮工具调用很容易打满。neonity 在每次 LLM 调用前检查 token 预估：

1. **Token 估算**：用简单字符级启发式（非精确 tokenizer）估计系统提示词 + 工具定义 + 对话历史的总 token 数。
2. **预算检查**：保留 25% 的窗口给输出。如果超了，触发管理策略。
3. **消息分组**：将 `(assistant tool_use → user tool_result)` 视为原子单元——它们要么一起保留，要么一起丢弃。
4. **两种策略**：
   - **truncation**（默认）：从头丢弃最旧的消息组，保持最近 N 组。
   - **summarization**：用 LLM 把旧对话压缩成一段 `[Context Summary]`，包含关键决策、文件修改、错误和任务状态。

---

## Provider 层：一个接口统领 6 个 API

这是个让我很满意的设计。所有 LLM 提供商——Anthropic、OpenAI、Gemini、DeepSeek、Minimax、GLM——全部实现同一个接口：

```typescript
interface Provider {
  readonly name: string;
  readonly model?: string;
  chat(
    messages: Message[],
    tools: ToolDefinition[],
    callbacks?: StreamCallbacks,
    systemPrompt?: string
  ): Promise<ProviderResponse>;
}
```

每个 Provider 适配器的工作就是把 neonity 的内部格式（`Message`、`ContentBlock`）翻译成各 API 的原生格式。比如 Anthropic 适配器需要处理 `tool_use` 和 `tool_result` 这两种特殊的 content block，而 OpenAI 适配器需要把它们映射到 `function_call` 和 `function` role。

**更妙的是，ProviderRouter 也实现了 Provider 接口。** Agent 分不清自己在跟一个直连 Claude 的适配器对话，还是在跟一个背后有 6 个模型、带着熔断和降级策略的智能路由器对话。这种多态设计让整个系统的复杂度被完美封装。

---

## Smart Router：给 Agent 加一个"聪明的调度员"

这是我给 neonity 加的"超纲"功能——Claude Code 本身只有 Claude，但 neonity 可以同时接入 6 个模型，然后根据任务复杂度自动选择最合适的。

### 成本分层

| 层级 | 用途 | 例子 |
|------|------|------|
| `cheap` | 简单、低风险查询 | "git status 是什么意思"、列出文件 |
| `standard` | 日常编码任务 | 中等复杂度，默认层级 |
| `premium` | 复杂、高风险任务 | 大规模重构、深度调试、安全审计 |

### 复杂度分析

路由器不会魔法。它用的是**关键词启发式**——`refactor`、`debug`、`security`、`concurrency` 这些词暗示高复杂度；多轮对话和历史工具使用也会自动升级到 premium。整个分析函数不到 100 行。

### 弹性设计

- **熔断器**：连续失败 N 次（默认 3）后暂时禁用该 provider，30 秒后尝试半开恢复。
- **指数退避**：同层内重试使用 1s → 2s → 4s 的退避策略加随机抖动。
- **跨层降级**：cheap 全挂了自动升级到 standard，standard 全挂了升级到 premium。
- **Round-robin 负载均衡**：同层多个 provider 轮询分发。

这些模式在分布式系统中很常见，但用在一个终端 AI 助手上，有种奇妙的"过度工程之美"。

---

## Tool 系统：Agent 的手和脚

如果没有工具，Agent 只是一个聊天机器人。有了工具，它能读写文件、执行命令、搜索网络。

neonity 的内置工具都实现同一个 `Tool` 接口：

```typescript
interface Tool {
  readonly name: string;
  readonly description: string;
  readonly inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute(input: Record<string, unknown>): Promise<string>;
}
```

关键是 `inputSchema`——这个 JSON Schema 会被塞进系统提示词里，告诉 LLM："你可以调用 `bash` 工具，它接受一个 `command` 参数"。LLM 看到这个，就知道什么时候该执行 shell 命令，什么时候该读文件。

Bash 工具有一个 30 秒超时，防止失控。Edit 工具用的是精确字符串匹配替换，确保修改的原子性——这和 Claude Code 的编辑策略一致。

---

## Skill 系统：可插拔的能力注入

Skills 是 neonity 最轻量的扩展机制。一个 Skill 本质上就是一段**追加到系统提示词的 Markdown 文本**。

```typescript
interface Skill {
  readonly name: string;
  readonly description: string;
  readonly systemPrompt: string;  // 注入到 Agent 系统提示词
  readonly tools?: Tool[];        // 可选：额外注册的工具
}
```

比如 `git-committer` skill 激活后，系统提示词里会多出一段：

```markdown
## Active Skill: git-committer
You are a git commit assistant. When asked to commit changes:
1. Review changes using `git diff --staged`
2. Write conventional commit messages (feat/fix/refactor/docs...)
3. Execute and confirm
```

就这么简单。LLM 看到这段指令后，它的提交行为就会遵循 Conventional Commits 规范。状态持久化到 `~/.neonity/skills.json`，下次打开还在。

---

## 流式输出：让终端活起来

没有人喜欢盯着空白屏幕等 AI 思考。neonity 的流式输出系统把一个冰冷的 API 调用变成了生动的终端体验：

1. LLM 每返回一段文本 delta，就实时显示在终端上。
2. 遇到工具调用时暂停文本渲染，显示 `⟳ bash` 这样的工具标签。
3. 工具返回结果后根据输出类型做不同展示：单行结果 → 内联显示；多行结果 → 折叠在框里。
4. 每个工具调用结束显示 token 消耗：`💰 2.3K in + 0.5K out = 2.8K`。
5. 所有输出经过 **Markdown 渲染器**：代码块有语法高亮，粗体/斜体/删除线/标题/列表/引用全部支持。

每次看到终端里的 Markdown 渲染效果，我都有一种"这居然能跑在终端里"的惊叹。

---

## 构建过程：和 Claude Code 的协作模式

整个构建过程不是传统的"写代码→跑→调试→改"循环，而是一种**对话式构建**。典型的工作流是这样的：

```
我：帮我实现一个 Provider 接口和工厂函数。

Claude Code：好的，我先看看现有的类型定义和目录结构。
  ⟳ read /src/types.ts
  ⟳ read /src/provider/provider.ts
  ⟳ bash ls /src/provider/

[看完之后]
我来创建 factory.ts，它会根据 provider 类型返回正确的适配器实例……

我：[看着代码跑起来，发现问题]
   DeepSeek 的 reasoning content 在流式输出中丢失了。

Claude Code：让我检查 deepseek-provider.ts 的流式处理逻辑……
  ⟳ read /src/provider/deepseek-provider.ts
[定位到问题，修复，验证]
```

这个协作模式有几个关键特征：

### 1. 我负责架构决策，AI 负责实现细节

Provider 接口长什么样、Router 应该有三层还是两层、Skill 用系统提示词注入还是函数调用——这些"为什么"的问题，我来拍板。具体怎么写适配器、怎么处理 API 的错误响应、怎么解析流式数据——这些"怎么做"的问题，交给 AI。

### 2. 多 Provider 本身就是安全网

最有趣的一点是：我在写多 Provider 支持的时候，正在用 DeepSeek 模型的 Claude Code。所以某种意义上，**我在用一个蒸馏过的模型去写一套能和多个模型对话的系统**。当一个 provider 的实现有问题时，我可以切换到另一个作为对照。

### 3. 增量构建，每层可测

先搭类型骨架（`types.ts`）→ 再写配置加载（`config.ts`）→ 然后逐个添加 provider 适配器，每写一个就切过去测一次 → 接着是工具系统，每个工具独立测试 → Agent 循环组装起来后，用一个简单的"你好"验证 → 最后加流式输出和 REPL 的美化。

整个过程不需要写 mock，不需要搭测试环境——直接在真实 API 上调。

---

## 数据说话

| 指标 | 数字 |
|------|------|
| 总 commit 数 | 7 |
| 核心源码行数 | ~5,000 行 TypeScript |
| 支持 LLM 提供商 | 6 个（Anthropic / OpenAI / Gemini / DeepSeek / Minimax / GLM） |
| 内置工具 | 7 个（bash / read / write / edit / web-search / hn-top / memory） |
| 内置技能 | 6 个 |
| 从零到 v0.1.0 | 一个周末 |

---

## 蒸馏的"反向"思考

传统意义上的模型蒸馏（knowledge distillation）是：一个大模型教一个小模型，让小的学会大的行为。**用 Claude Code 构建 neonity 是一种逆向蒸馏**：

- 不是蒸馏模型的权重，而是蒸馏模型的**行为模式**和**架构决策**。
- 你用 Claude Code 的体验来反推它应该有哪些模块。
- 你在设计的过程中不断问自己："为什么 Claude Code 要这样做？这个设计取舍背后的理由是什么？"
- 最终你得到的不是一个模型，而是一套**可运行的结构化知识**。

这是一种新的学习方式。以前学一个系统的设计，只能读源码或看架构图。现在你可以直接和一个能帮你写代码的 AI 对话，说："帮我实现一个类似 X 系统的 Y 模块"，然后看着它生成的代码，逐个理解、修改、优化。

---

## 你也可以试试

如果你想自己动手，这里是一个最小的起点：

**第一天的目标**：一个单 Provider、能调用 bash/read/write 工具的 REPL。

```bash
# 1. 定义核心类型（Message, ContentBlock, Tool, Provider）
# 2. 实现一个 Provider 适配器（只接 Anthropic API）
# 3. 实现 bash、read、write 三个工具
# 4. 写 REACT Agent 循环
# 5. 用 readline 包一个最简单的 REPL
```

这五个步骤大概 500 行代码，一晚就能跑通。之后再加什么都不难——因为骨架已经在里面了。

完整的 neonity 源码附带一个 13 章的互动式教程（`/tutorial` 目录），从类型系统到上下文管理，每一步都有详细的解释和可运行的代码。如果你想深入了解每个模块的实现，那里是最好的起点。

---

*写于一个和 Claude Code 协作的周末。*
