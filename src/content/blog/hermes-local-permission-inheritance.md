---
title: 'Hermes Agent能操作我的GitHub？聊聊本地权限继承'
description: 'Hermes Agent以本地用户身份运行，继承了已有的gh CLI授权。聊聊这个机制的安全便利与注意事项。'
pubDate: 2026-04-12
heroImage: ''
tags: ['技术', 'Hermes', 'GitHub', '安全']
---

## 一件让我惊讶的事

今天让 Hermes 帮我把博客推送到 GitHub，它直接就成功了。我从来没有给 Hermes 授权过 GitHub 啊？

排查了一下，恍然大悟。

## 原因很简单

Hermes Agent 跑在我的 MacBook 上，**以我的用户身份运行**。

我之前在这台电脑上用 `gh auth login` 登录过 GitHub，登录凭证存在 macOS 钥匙串（Keychain）里。Hermes 作为本机进程，自然能读取到这个 token。

```
我的 Mac
├── gh CLI（已登录，token 在 Keychain）
├── Hermes Agent（以我的用户身份运行）
│   └── 调用 gh → 读取 Keychain → 操作成功 ✅
```

不需要额外授权，因为它就是"我"。

## 不仅仅是 GitHub

这个机制不仅限于 GitHub。理论上 Hermes 可以继承本机上**所有当前用户权限范围内的能力**：

| 已有授权 | Hermes 能做什么 |
|---------|----------------|
| GitHub (`gh auth`) | 创建/删除仓库、推送代码、管理 PR |
| SSH 密钥 | 访问已配置的服务器 |
| npm 登录 | 发布 npm 包 |
| Docker | 操作本地容器 |
| 文件系统 | 读写当前用户有权限的任何文件 |

## 这是特性，也是风险

**好处：**
- 🚀 零配置——本地能做的事，Hermes 也能做
- 🔑 不需要单独管理 API Key
- 💡 和"助手坐在你电脑前操作"是一样的

**需要注意的：**
- ⚠️ Hermes 拥有和你一样的权限，操作前最好确认
- 🔒 如果担心过度授权，可以用 Fine-grained PAT 限制范围
- 🧹 不用的授权记得及时清理

## 我的做法

目前我选择信任这个模型，但保持警惕：

1. Hermes 只做我明确要求的事
2. 涉及删除、发布等破坏性操作时，我会格外注意
3. 重要服务考虑用最小权限原则配置

## 结语

本地运行的 AI Agent 和云端 AI 最大的区别之一就是——**它继承你的身份**。

这既是最强大的地方（无需配置就能用），也是最需要小心的地方（能力越大，责任越大）。

理解了这个机制，就能更好地和安全地使用本地 AI Agent。

---

*本文基于 Hermes Agent 在 macOS 上的实际行为编写。*
