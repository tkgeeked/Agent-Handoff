# 🤖 AgentHandoff

[简体中文](#简体中文) | English

A lightweight, developer-focused framework designed to **eliminate the context gap and onboarding friction when switching between different AI coding assistants** (such as **Claude Code**, **Codex**, **Hermes Agent**, **Antigravity**, **Cursor**, and **Windsurf**) on the same project.

---

## Why This Exists

When developing a project, you often switch between different AI agents to leverage their unique strengths. However, this creates a major pain point: **every new agent session starts with a blank slate**. You have to manually re-explain:
1. The project's overall roadmap and what was *just* completed.
2. The coding standards and directory layout rules.
3. The technical decisions and logic behind recent modifications.

This system acts as a **universal handoff protocol**. By forcing every agent to maintain a standardized, self-updating **Active Dashboard** and **Development Log** in the repository, any incoming agent can read the files and immediately resume work exactly where the last one left off—zero explanations required.

---

## Core Mechanisms

```text
 [AI Agent A]                                                         [AI Agent B]
  (Finishes)                                                           (Starts)
      │                                                                   │
      ▼                                                                   ▼
Writes Handoff Log ──> [ Active Dashboard & Dev Log ] ──> Reads Handoff Log & Onboards
Updates Task list      (README.md / CLAUDE.md / AI.md)    Knows context instantly
```

1. **Active Dashboard (README.md / CLAUDE.md / AI.md)**: A single source of truth updated by the working agent containing the current file structure and live task statuses.
2. **Reverse-Chronological Dev Log**: A chronological journal appended by the agent at the end of every session, capturing *Actions*, *Decisions*, *Build Status*, and *Next Steps*.
3. **Directory Hygiene Boundaries**: Enforced separation between source code, tests, docs, and temporary scratchpads (git-ignored `.scratch/` directories).

---

## Platform Support Matrix

| Tool / Agent | Target File | Onboarding Mechanism |
| :--- | :--- | :--- |
| **Claude Code** | `CLAUDE.md` | Reads build/test commands and project rules at startup. |
| **Antigravity / Codex** | `SKILL.md` | Loads as a custom skill/tool rule dynamically from `.agents/`. |
| **Cursor / Windsurf** | `.cursorrules` / `.windsurfrules` | Ingests instructions and file placement policies as system prompts. |
| **Hermes / General LLMs** | `README.md` | Leverages the designated `🤖 AI Agent Entrypoint` section. |

---

## File Structure

*   `SKILL.md`: Skill definition metadata for Antigravity & Codex environments.
*   `resources/README.template.md`: Boilerplate markdown dashboard for new repositories.
*   `resources/CLAUDE.md.template`: Pre-configured environment rules and build commands for Claude Code.
*   `references/best_practices.md`: Clear guidelines on modularity, dry runs, error logging, and scratch file hygiene.

---

## Setup & Installation

### 1. Global Setup (Automatically active across all workspaces)

For Antigravity/Codex:
```bash
git clone https://github.com/tkgeeked/agent-handoff.git ~/.gemini/config/skills/agent-handoff
```

### 2. Local Project Integration

Clone the rules into your project's agent folder:
```bash
mkdir -p .agents/skills
git clone https://github.com/tkgeeked/agent-handoff.git .agents/skills/agent-handoff
```

#### For Claude Code
Copy the Claude-specific configuration to your root:
```bash
cp resources/CLAUDE.md.template /path/to/your/project/CLAUDE.md
```

#### For Other Agents (Hermes, Cursor, Windsurf)
Copy the template README or append the `🤖 AI Agent Entrypoint` section to your existing `README.md`:
```bash
cp resources/README.template.md /path/to/your/project/README.md
```

---

## License

MIT License. Feel free to customize it for your specific tech stacks (Node.js, Python, Go, Rust, etc.).

---

## 简体中文

# AgentHandoff - AI 项目接管与自我治理规范

这是一个轻量级、面向开发者的项目治理框架，旨在**消除在同一个项目上切换不同 AI 助手时（如 Claude Code, Codex, Hermes Agent, Antigravity, Cursor, Windsurf）的信息差与接管摩擦**。

---

## 解决的问题

在实际开发中，我们经常会在同一个项目里混用不同的 AI 工具以发挥各自所长。但这也带来了一个巨大的痛点：**每次切换 AI 助手，它对项目当前的进度都是一无所知的**。你必须不厌其烦地重新向它说明：
1. 项目的整体进度、当前进行到哪一步、下一步该做什么。
2. 本项目的目录结构规范和代码编写约束。
3. 最近代码修改背后的设计意图和技术决策。

本规范充当了 **AI Agent 之间的“万能交接协议”**。通过在仓库中建立一个自我更新的**活体看板**（Active Dashboard），让每一个工作的 AI 在退出前自动更新状态并撰写日志，任何新接入的 AI 助手只需读取该文档，即可立即进入状态，无缝接力开发。

---

## 核心机制

```text
 [AI 助手 A]                                                           [AI 助手 B]
 (工作结束)                                                            (接手工作)
     │                                                                     │
     ▼                                                                     ▼
写入交接日志 ───> [ 统一活体看板 & 开发日志 ] ───> 读取交接日志 & 初始化 onboarding
更新任务看板     (README.md / CLAUDE.md / AI.md)   瞬间消除信息差，立即开始编码
```

1. **活体看板 (README.md / CLAUDE.md / AI.md)**：由 AI 助手在开发中实时维护的单一事实来源，包含最新文件树和当前任务状态。
2. **逆序开发日志**：AI 助手在每次会话结束前记录的简短日志，包括所做更改、技术选型决策及明确的下一步交接任务。
3. **严格的目录边界**：清晰定义生产代码、测试、以及临时脚本的存放位置，禁止非生产文件污染主干目录（引入 `.gitignore` 的 `.scratch/` 目录）。

---

## 平台适配矩阵

| AI 工具 / 代理 | 目标配置文件 | 作用机制 |
| :--- | :--- | :--- |
| **Claude Code** | `CLAUDE.md` | 启动时自动读取构建、测试命令及代码风格约束。 |
| **Antigravity / Codex** | `SKILL.md` | 动态加载为项目或全局 Skill，规范底层行为逻辑。 |
| **Cursor / Windsurf** | `.cursorrules` / `.windsurfrules` | 注入为系统提示词，确立目录结构规则和代码规范。 |
| **Hermes / 通用 LLM** | `README.md` | 通过阅读专门的 `🤖 AI Agent Entrypoint` 锚点段落引导接管。 |

---

## 目录结构

*   `SKILL.md`：适配 Antigravity / Codex 自定义 Skill 系统的配置文件。
*   `resources/README.template.md`：用于新项目初始化的通用 README 看板模板。
*   `resources/CLAUDE.md.template`：适用于 Claude Code 的构建、测试与代码规范配置模板。
*   `references/best_practices.md`：面向 AI 的模块化编程、异常处理与工作区卫生规范手册。

---

## 安装与配置

### 1. 全局配置 (所有项目默认可用)

针对 Antigravity/Codex：
```bash
git clone https://github.com/tkgeeked/agent-handoff.git ~/.gemini/config/skills/agent-handoff
```

### 2. 单个项目集成

将规范放入项目的 agent 目录：
```bash
mkdir -p .agents/skills
git clone https://github.com/tkgeeked/agent-handoff.git .agents/skills/agent-handoff
```

#### 对于 Claude Code
将 Claude 专属配置文件复制到项目根目录下：
```bash
cp resources/CLAUDE.md.template /path/to/your/project/CLAUDE.md
```

#### 对于其他 Agent (Hermes, Cursor, Windsurf)
直接将模板 README 复制到根目录，或将 `🤖 AI Agent Entrypoint` 锚点段落合并进你现有的 `README.md` 中：
```bash
cp resources/README.template.md /path/to/your/project/README.md
```

---

## 开源协议

MIT License. 你可以根据你的技术栈（Node.js, Python, Go, Rust 等）进行定制。
