# 🤖 AI Agent Governance & Handoff System

这是一个通用的 **AI Agent 项目接管与自我治理规范**。它被设计用于帮助各种不同的 AI 编码助手（包括 **Claude Code**、**Codex**、**Hermes Agent**、以及 **Antigravity**）在开发过程中保持项目结构的整洁，并通过“Live 面板 + 逆序开发日志”机制，实现完美的开发进度接力。

本规范的灵感源自知识库治理项目中的 AI 接管首页机制，经过抽象后，现已成为一个适用于任何开发项目的通用行为准则。

---

## 📂 规范文件结构

*   `SKILL.md`：适配 Antigravity / Codex 等支持 Skill 插件体系的 agent 的入口规范描述文件。
*   `resources/README.template.md`：项目通用 `README.md` 模板，内置 `## 🤖 AI Agent Entrypoint` 段落，可使任何 Agent 迅速接管项目状态。
*   `resources/CLAUDE.md.template`：为 **Claude Code** 准备的控制台和指令行为规范模板。
*   `references/best_practices.md`：面向 AI 编写的模块化设计、错误处理、Git 提交与临时文件清理的最佳实践手册。

---

## 🛠 安装与使用方法

通过终端，你可以将本规范安装到不同 Agent 的配置目录下：

### 1. 对于 Antigravity / Codex
你可以将本 Skill 克隆到全局配置目录下，使其在所有项目中自动激活：
```bash
git clone https://github.com/[你的GitHub用户名]/[仓库名].git ~/.gemini/config/skills/ai-agent-governance
```
或者，仅在当前项目生效：
```bash
mkdir -p .agents/skills
git clone https://github.com/[你的GitHub用户名]/[仓库名].git .agents/skills/ai-agent-governance
```
然后对 AI 助手说：
> "请使用 `ai-agent-governance` 规范接管本项目。"

### 2. 对于 Claude Code
将 `resources/CLAUDE.md.template` 复制为当前项目根目录下的 `CLAUDE.md`：
```bash
cp resources/CLAUDE.md.template [目标项目路径]/CLAUDE.md
```
Claude Code 会在启动时自动读取此文件中的开发规范与指令规则。

### 3. 对于 Hermes Agent / 其他通用 Agent
在新项目初始化时，可以直接复制 `resources/README.template.md` 并重命名为 `README.md`，或者将 `## 🤖 AI Agent Entrypoint` 部分追加到项目现有的 `README.md` 中：
- Agent 启动时会优先扫描 `README.md`，从而能够无缝得知最新的代码规范、已完成/待办任务，并在退出前更新日志。

---

## 📖 核心规则摘要

1.  **接管首读**：AI 每次接管项目时，必须首先检查开发日志和任务追踪器，切忌盲目开始编码。
2.  **活体面板 (Active Dashboard)**：当文件树变化或任务状态改变时，AI 必须实时同步更新文档，保持项目自解释。
3.  **逆序日志 (Reverse Chronological Journal)**：每一次会话结束前，AI 需要以固定格式向开发日志（README/CLAUDE/AI.md）追加一条带有时间戳的交接日志。
4.  **环境卫生**：禁止乱放临时或调试脚本，所有 scratch 脚本必须写到 `scratch` 文件夹或加入 `.gitignore`。
