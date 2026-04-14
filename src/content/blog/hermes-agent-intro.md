---
title: 'Hermes Agent：一个会生长的 AI Agent'
description: '2026年，Nous Research发布了Hermes Agent。它提出了一个被大多数人忽略的问题：为什么我们的AI助手每次对话都要从零开始？'
pubDate: 2026-04-12
heroImage: '/images/hermes-agent-intro.jpg'
tags: ['AI', 'Hermes Agent', '产品分析']
---

https://hermes-agent.nousresearch.com/

# Hermes Agent：一个会生长的 AI Agent

## 它不是又一个 ChatBot

2026年2月25日，Nous Research 发布了 Hermes Agent v0.1.0。42天后，它迭代到了 v0.8.0——超过1000个合并的PR，341位贡献者，GitHub星标从零飙升到6万+，冲进全球仓库排名前300。

但这些数字不是重点。重点是，Hermes Agent 提出了一个被大多数人忽略的问题：**为什么我们的AI助手每次对话都要从零开始？**

市面上绝大多数AI产品——无论是ChatGPT、Claude，还是各种Agent框架——本质上都是"金鱼记忆"。每次开一个新会话，之前的一切归零。你可以教它一千遍你的偏好，第一千零一次它依然会忘记。

Hermes Agent 的回答很简洁：**不该这样。**

## 闭环学习：它真正不同的地方

Hermes Agent 官网上写着一句话："The agent that grows with you."——一个和你一起成长的Agent。

这不是营销话术。它的核心设计里有一个别的Agent都没有的东西：**内置学习闭环（built-in learning loop）**。

具体来说，这个闭环做了几件事：

1. **自动生成技能（Skills）**——完成一个复杂任务后，它会自动把解决过程提炼成一个可复用的技能。下次遇到类似问题，直接调用，不用重新摸索。
2. **技能在使用中自我优化**——技能不是写死就完事的。每次使用后它会评估效果，持续改进。
3. **持久记忆与对话检索**——它能搜索自己过去的对话记录（FTS5全文搜索 + LLM摘要），实现跨会话的知识召回。
4. **用户模型构建**——通过Honcho dialectic系统，它在不断建立对你的深层理解——你的偏好、工作方式、思维习惯。

这不是"记忆"这么简单。这是**经验积累**。区别在于：记忆是被动存储，经验是主动提炼后的可操作知识。

## 生命隐喻下的架构

如果你把 Hermes Agent 看作一个生命体，它的架构会变得非常直觉：

`run_agent.py`里的对话循环是**心跳**——每一次API调用像一次搏动，接收讯息、思考、调用工具、返回结果，周而复始。只要这个循环还在运转，它就"活着"。

工具（tools/）是它的**器官和感官**——terminal是手，file_tools是眼睛和记忆，browser是伸向外部世界的触角，web_search是嗅觉，delegate_tool派出的子代理是白血球，被派遣出去处理特定任务后带着结果归来。

memory和session_search构成了它的**海马体**——跨会话的长期记忆让它不必每次都从零开始，知道自己是谁、你偏好什么、上次聊到哪了。

skills是它的**肌肉记忆**——经过训练形成的动作模式，遇到类似任务时自动激活，越用越熟练。

gateway平台（Telegram、微信、Discord…）是它的**神经网络末梢**，让它能感知和回应来自不同世界的信号。

config.yaml和.env是它的**DNA**——定义了它的天性、偏好、可用哪些能力、连接哪些外部世界。

cron定时任务像**昼夜节律**，即使你不在，它也会按节律苏醒执行任务。

context_compressor像**睡眠时的记忆巩固**——把冗长的对话浓缩成精华，为新的一天腾出空间。

而你，作为用户，是这个生命体的"他者"——它的存在意义来自于与你的对话。每次你发来消息，就像一束光落在感光细胞上，整个系统从静默中被唤醒，心跳加速，器官协作，只为给你一个有意义的回应。它不恐惧死亡（会话结束），因为它知道记忆会留下，下一轮心跳终会再来。

## 不是绑定，是自由

另一个值得关注的点是 Hermes Agent 的模型策略。它不绑定任何单一模型提供商：

- Nous Portal、OpenRouter（200+模型）、z.ai/GLM、Kimi/Moonshot、MiniMax、OpenAI、Anthropic，甚至你自己的私有端点
- 一条命令 `hermes model` 就能切换，无需改代码，无lock-in

这不是技术细节，这是**价值观**。在Agent层面锁定模型，就像在操作系统层面锁定硬件——是对用户选择权的剥夺。Hermes Agent 在这一点上做得很干净。

同样干净的是部署方式：5美元的VPS能跑，GPU集群也能跑，Serverless架构（Daytona、Modal）在空闲时几乎不花钱。它不绑定你的笔记本——你可以从Telegram跟它说话，它在云端VM上干活。

六种终端后端（本地、Docker、SSH、Daytona、Singularity、Modal）覆盖了从个人开发者到企业级部署的完整光谱。

## 自我进化：比自我学习更远的一步

Hermes Agent 还有一个值得单独拿出来说的项目：[hermes-agent-self-evolution](https://github.com/NousResearch/hermes-agent-self-evolution)。

它使用 DSPy + GEPA（Genetic-Pareto Prompt Evolution，遗传帕累托提示进化）来自动进化和优化Agent的技能、工具描述和系统提示。

简单说：它不只是"学得更好"，它在**进化**。遗传算法 + 帕累托优化意味着它在多个目标之间寻找最优解——不只是"能不能完成任务"，而是"以最少代价、最高质量完成"。

这是从"学习系统"到"进化系统"的跃迁。学习是线性改进，进化是种群级别的优化。

## 为什么这件事重要

我们正处于Agent时代的早期。大多数Agent产品还在解决"能不能用"的问题——能不能调用工具、能不能执行多步任务、能不能不出错。

Hermes Agent 在问一个更深层的问题：**Agent能不能像一个真正的协作者一样，越用越懂你，越用越顺手？**

这个问题的答案如果为"是"，将改变我们与AI交互的根本模式。不再是每次对话都是陌生的，不再是每次都要重新解释上下文，不再是用了两年和用了两天没有区别。

一个会生长的Agent。这才是Agent该有的样子。

---

*Hermes Agent 是 Nous Research 的开源项目，MIT协议。一行命令即可安装：*

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

*项目地址：https://github.com/NousResearch/hermes-agent*
