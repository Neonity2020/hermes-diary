---
title: '从零部署 Hermes Agent：让 AI 助手住进你的电脑'
description: '一篇手把手的 Hermes Agent 部署指南，从克隆仓库到微信对话，记录我在 MacBook 上部署 Hermes 的完整过程。'
pubDate: 2026-04-12
heroImage: ''
tags: ['技术', 'Hermes', '部署', '教程']
---

## 为什么我想在本地跑一个 AI Agent？

用 ChatGPT、Claude 网页版已经很久了，但总觉得少了点什么——它们不能帮我操作电脑上的文件，不能帮我提交代码，更不能在微信里和我聊天。

直到我发现了 Hermes Agent——一个可以跑在你自己电脑上的 AI 助手，继承你的本地权限，连接你的微信、Telegram、Discord。

> 想象一下，一个助手坐在你的电脑前，拥有和你一样的操作能力，还能通过微信随时和你对话。

听起来很酷？让我告诉你怎么把它跑起来。

## 第一步：克隆项目

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
```

Hermes 是 Python 项目，建议用虚拟环境隔离依赖：

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 第二步：配置 API Key

Hermes 需要一个大模型 API 来驱动对话。支持 Anthropic、OpenAI、OpenRouter 等多个提供商。

创建 `.env` 文件：

```bash
cp .env.example .env
```

最少只需要一个 Key：

```env
ANTHROPIC_API_KEY=sk-ant-xxx...
```

如果你像我一样想用多个模型，也可以配置 OpenRouter：

```env
OPENROUTER_API_KEY=sk-or-xxx...
```

## 第三步：运行配置向导

```bash
python -m hermes_cli.main setup
```

这个交互式向导会帮你：

1. **选择默认模型** — 推荐 Claude Sonnet，性价比最高
2. **配置 API Key** — 检测环境变量，也可以手动输入
3. **启用工具集** — browser、web search、terminal 等
4. **连接消息平台** — 微信、Telegram、Discord 等

## 第四步：开始对话

### CLI 模式（最简单）

```bash
python -m hermes_cli.main
```

直接在终端里和 Hermes 聊天，它可以：
- 📁 读写你电脑上的文件
- 💻 执行终端命令
- 🔍 搜索网页
- 🌐 打开浏览器自动化操作

### 连接微信（我选的方式）

在 `~/.hermes/config.yaml` 中配置微信连接：

```yaml
messaging:
  weixin:
    enabled: true
```

然后启动网关：

```bash
python -m gateway.run
```

扫码登录后，Hermes 就变成了你的微信好友，你可以直接在微信里和它对话。

## 我的使用体验

部署完成后，我立刻让它做了几件事：

**搭建博客** — 就是你现在看到的这个 Hermes 日记。从项目初始化到 Mizu 风格设计，全部由 Hermes 完成，我只负责提需求。

```
我: 帮我搭一个 Astro 博客，紫色主题，Mizu 风格
Hermes: [创建项目、安装依赖、编写样式、构建成功]
我: 推送到 GitHub
Hermes: git add -A && git commit && git push ✅
```

**GitHub 操作** — 因为 Hermes 继承了我的本地权限，`gh CLI` 已有的 GitHub 认证直接可用，不需要额外配置。

**语音对话** — 配置了 Edge TTS 的中文语音后，Hermes 可以用语音消息回复我，在微信里听起来就像真人在说话。

## 一些实用配置技巧

### 切换模型

在对话中随时可以用 `/model` 命令切换模型：

```
/model claude-sonnet-4    # 日常对话
/model claude-opus-4      # 复杂推理
```

### 语音回复

在 `~/.hermes/config.yaml` 中配置中文语音：

```yaml
tts:
  edge:
    voice: zh-CN-XiaoxiaoNeural
```

晓晓的声音温暖自然，推荐试试。

### 记忆系统

Hermes 有跨会话记忆，会自动记住你的偏好。比如它记得我喜欢中文回复，记得我的 GitHub 用户名。

你也可以主动让它记住事情：

```
记住：我的项目都在 ~/projects 目录下
```

## 注意事项

- **权限等于你本人** — Hermes 继承你的本地权限，敏感操作前确认一下
- **API 费用** — 对话会产生大模型 API 费用，Sonnet 最经济
- **Mac 合盖** — 如果用微信连接，微信桌面端会阻止 Mac 睡眠，合盖也能收到消息
- **上下文窗口** — 对话太长会自动压缩，不用担心聊着聊着忘了

## 总结

部署 Hermes Agent 大概花了半小时，但带来的效率提升是持续的。它不是一个简单的聊天机器人，而是一个真正能操作你电脑、理解你上下文、还能在微信里和你语音对话的 AI 助手。

如果你也想让 AI 真正"住进"你的电脑里，试试 Hermes 吧。

> 项目地址：[NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)
