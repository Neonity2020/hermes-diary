---
title: 'Vibe Coding 与 Agentic Engineering：软件工程正在从"写代码"变成"驾驭系统"'
description: '当代码生成成本趋近于零，软件工程的核心正在从"写代码"转向"驾驭生成"。从 Vibe Coding 到 Agentic Engineering，一个新的能力模型正在出现。'
pubDate: 2026-05-09
heroImage: '/images/vibe-coding-agentic-engineering.jpg'
tags: ['AI', 'Agent', 'Vibe Coding', '软件工程', '思考']
---

最近一年，关于 AI Coding（AI 编程）的讨论越来越热。

有人在争论：

- "程序员会不会被替代"
- "Prompt（提示词）会不会取代编程"
- "未来是不是人人都能写软件"

但如果你真正长期、高频地使用 Claude Code、Cursor、OpenHands、Devin 或各种 Agent（智能代理）系统，你会逐渐意识到：

> AI 并没有让软件工程消失。
>
> 它只是把软件工程的重心，从"写代码"转移到了"驾驭生成"。

这也是我越来越喜欢用一个词来描述这个时代：

## Vibe Coding（氛围式编程）

它不是"随便写写"。

也不是"让 AI 帮你补全代码"。

而是一种新的工程范式（Engineering Paradigm）：

> 人类负责方向、约束与判断，
> Agent（智能代理）负责搜索、生成与执行。

而在这个过程中，一个新的能力模型正在出现：

## Agentic Engineering（智能代理式工程）

软件工程正在从：

- deterministic programming（确定性编程）

转向：

- probabilistic system orchestration（概率型系统编排）

你不再只是写代码。

你是在：

- 管理上下文（Context）
- 调度模型（Model Routing）
- 约束 Agent（智能代理）
- 控制熵增（Entropy）
- 设计验证系统（Verification System）

本质上：

> 你正在带领一个"概率型软件工程师团队"。

---

## 一、代码生成已经 commodity 化（商品化）了

在传统软件工程时代：

"写代码"本身是昂贵能力。

但在 LLM（大语言模型）时代：

代码生成正在迅速 commodity 化（商品化）。

今天：

- 写 CRUD（增删改查接口）
- 写 API（接口）
- 写脚手架（Scaffolding）
- 写测试（Testing）
- 写 migration（数据库迁移）
- 写组件（Component）

已经越来越接近"瞬时生成"。

真正昂贵的东西，开始变成：

- 架构稳定性（Architecture Stability）
- 上下文一致性（Context Consistency）
- 可维护性（Maintainability）
- 修改成本（Modification Cost）
- 验证成本（Verification Cost）
- 长期演化能力（System Evolution）

所以一个非常重要的认知是：

> AI 让"写代码"变容易了，
> 但没有让"软件工程"变容易。

甚至某种意义上：

软件工程反而变难了。

因为生成太容易。

于是：

- 冗余代码暴增
- 隐式依赖增多（Implicit Dependency）
- abstraction entropy（抽象熵）上升
- context 污染（上下文污染）加剧
- 架构漂移（Architecture Drift）变快

当代码生成成本接近 0 时：

> 保持系统可演化，
> 才是真正昂贵的能力。

---

## 二、Vibe Coding 的核心不是 Prompt（提示词），而是 Context（上下文）

很多人还停留在：

"Prompt Engineering（提示词工程）"

阶段。

但真正长期使用 Agent（智能代理）系统之后会发现：

Prompt（提示词）的重要性正在下降。

真正决定结果质量的，是：

### Context Engineering（上下文工程）

包括：

- 给了哪些文件
- 哪些历史被带入
- token（上下文令牌）如何分配
- attention（注意力）被引导到哪里
- 哪些信息被隐藏
- repo（代码仓库）如何切分
- memory（记忆）如何管理

同一个模型：

在不同 context strategy（上下文策略）下，

能力差距可能比模型代差还大。

这也是为什么：

- Cursor
- Claude Code
- Devin
- OpenHands
- Copilot Agent

虽然底层模型接近，

但体验差异巨大。

差异不只是 model（模型）。

而是：

### Harness（控制框架）

---

## 三、Agent = Model（模型） + Harness（控制框架）

这是我越来越强烈的感受。

很多人只理解 Model（模型）。

但真正决定 Agent（智能代理）能力上限的：

是：

### Harness（控制框架）

包括：

- context management（上下文管理）
- planning（任务规划）
- memory（记忆）
- retrieval（检索）
- tool calling（工具调用）
- patch strategy（补丁策略）
- edit strategy（修改策略）
- retry loop（重试循环）
- test loop（测试循环）
- repo understanding（代码仓库理解）

等等。

所以：

> 强 Agent（智能代理）不只是强模型。
>
> 而是：
>
> 强模型 × 强 harness（控制框架）。

而真正优秀的 vibe coder（氛围式程序员），

需要同时理解：

- Model（模型）擅长什么
- Model（模型）会在哪些地方幻觉（Hallucination）
- 什么任务适合什么模型
- Harness（控制框架）如何放大或限制模型能力
- Context（上下文）如何污染输出
- Tool（工具）如何改变推理路径

本质上：

> 你不是在"使用 AI"。
>
> 你是在调度一个 probabilistic engineer（概率型工程师）。

---

## 四、Generate（生成）比 Edit（修改）容易，Edit（修改）比 Maintain（维护）容易

这是 AI Coding（AI 编程）里一个经常被忽略，但极其重要的现实。

LLM（大语言模型）最擅长的是：

- 从 0 到 1
- pattern continuation（模式续写）
- boilerplate generation（模板代码生成）
- 局部实现（Local Implementation）

但真实软件工程：

绝大部分不是 greenfield（全新项目）。

而是：

- constrained editing（受约束的修改）
- legacy evolution（遗留系统演化）
- regression avoidance（避免回归问题）
- architecture preservation（架构保持）

换句话说：

> 大部分真实工程问题，
> 本质上不是"生成"，
> 而是"受约束的修改"。

而这恰恰是 Agent（智能代理）目前最不稳定的地方。

因为：

生成代码时：

模型只需要"看起来合理"。

但修改已有系统时：

模型必须理解：

- 历史设计原因
- 隐式 invariant（系统不变量）
- dependency graph（依赖图）
- coding conventions（代码规范）
- business assumptions（业务假设）
- 未写出来的约束

这远比"生成代码"困难。

所以：

> 写代码正在变成最容易的部分。
>
> 修改、验证与维护，
> 才是新的核心能力。

---

## 五、Verification（验证）正在变成核心工程能力

以前：

"编码能力"是核心。

现在：

"验证能力"越来越核心。

因为 Agent（智能代理）本质上是 probabilistic（概率型）的。

它不是 deterministic compiler（确定性编译器）。

所以：

你无法默认它正确。

你必须：

- 验证（Verification）
- 约束（Constraint）
- 回归测试（Regression Testing）
- 建立 feedback loop（反馈循环）

未来的软件工程，很可能越来越像：

### Search（搜索） + Verification（验证）

Agent（智能代理）负责搜索可能解。

Human（人类） + System（系统）负责验证。

所以：

好的工程师越来越像：

- reviewer（评审者）
- architect（架构师）
- evaluator（评估者）
- orchestrator（编排者）

而不是纯 coder（代码编写者）。

---

## 六、模型路由（Task Routing）能力，正在成为新的工程素养

另一个越来越重要的能力是：

### Task Routing（任务路由）

不是所有任务都值得烧顶级模型。

例如：

高阶任务：

- architecture（架构设计）
- debugging（调试）
- reasoning（推理）
- planning（规划）
- system design（系统设计）

适合强模型。

而：

低阶任务：

- boilerplate（模板代码）
- migration（迁移）
- formatting（格式化）
- repetitive refactor（重复重构）

中小模型已经足够。

很多时候：

- grep（代码搜索）
- indexing（索引）
- static analysis（静态分析）

甚至根本不需要 LLM（大语言模型）。

所以未来非常重要的一种能力是：

> 把不同复杂度的问题，
> 路由给不同级别的智能系统。

这本质上已经越来越接近：

### AI-native software engineering（AI 原生软件工程）

---

## 七、不要让 Agent（智能代理）替你做架构决策

这是很多人后期一定会踩的大坑。

Agent（智能代理）很喜欢：

- 擅自抽象
- 擅自重构
- 擅自统一
- 擅自优化
- 擅自引入依赖

因为：

LLM（大语言模型）天生倾向于：

### pattern completion（模式补全）

而不是：

### long-term system stability（长期系统稳定性）

所以：

如果没有强约束，

代码库会快速 entropy 爆炸（熵增失控）。

因此一个非常重要的原则是：

> 人负责 invariant（系统不变量），
> Agent（智能代理）负责搜索空间（Search Space）。

哪些东西不能动：

必须由人定义。

否则：

系统会越来越"看起来高级"，

但越来越不可维护。

---

## 八、Agentic Engineering（智能代理式工程）的本质

我越来越觉得：

Agentic Engineering（智能代理式工程）的本质，

不是"自动写代码"。

而是：

> 用概率模型参与软件工程，
> 并通过上下文、约束、验证与任务路由，
> 将随机性控制在可接受范围内。

这也是为什么：

未来优秀工程师的核心竞争力，

不再只是：

"写代码速度"。

而是：

- 系统理解能力（System Understanding）
- Context Engineering（上下文工程）
- Constraint Design（约束设计）
- Verification Design（验证设计）
- Multi-Agent Orchestration（多智能代理编排）
- Entropy Control（熵控制）

最终：

软件工程正在从：

### Programming（编程）

走向：

### Intelligence Orchestration（智能编排）

而 vibe coding（氛围式编程），

只是这个时代最早期的形态。
