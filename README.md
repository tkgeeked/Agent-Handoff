# 🤖 AgentHandoff — AI Agent 项目接管与进度无缝交接协议

[简体中文](#简体中文) | English

A universal handoff protocol for **long-lived projects worked on by multiple AI agents** (Claude Code, Codex, Antigravity, Cursor, Windsurf, Trae, GitHub Copilot…). Every agent reads and writes **one single file** — `handoff.md` — so switching agents is zero-friction: the next agent instantly knows what the project is, how far it has progressed, and exactly where to resume.

---

## Architecture & Principles (v3.0.2)

Traditional setups maintain per-platform dashboard files (`CLAUDE.md`, `README.md`, `.cursorrules`), which risk **forked dashboards**: agent A updates its file, agent B updates another, and state drifts apart.

AgentHandoff v3.0.2 fixes this with core principles:

| Principle | Legacy Multi-Board | AgentHandoff (v3.0.2) |
|:---|:---|:---|
| **Single source of truth** | Multiple dashboards (`CLAUDE.md` + `README.md` + …) | **Only `handoff.md`** — one board for all agents |
| **Thin entrypoints** | Platform files embedded full dashboards | Platform files are pure pointers ("read `handoff.md`"); **zero project data** |
| **Versioned backups** | None | Old versions of `handoff.md` / log are backed up to `backup/` before every change (never deleted) |
| **Unified log** | Log embedded in dashboards | All sessions logged to `docs/handoff-log.md` (archived, never deleted) |
| **Task lifecycle** | Binary todo/done | Rich states: `[ ]` Todo, `[/]` In Progress, `[x]` Done, `[!]` Blocked, `[~]` Cancelled |
| **Multi-stack auto-init** | Hardcoded npm commands | Incurs lockfile & toolchain context (`pnpm`, `bun`, `yarn`, `uv`, `poetry`, `cargo`, `go`, `mvn`, `gradle`, `cmake`) |

Plus: **smart auto-initialization** (agents autonomously bootstrap `handoff.md` & build commands in new repos), **smart splitting** (when `handoff.md` grows beyond 200 lines, agents split details into `docs/`), **self-healing takeover** for interrupted sessions, and a **clean-root rule**: only entry files live at root.

---

## Core Mechanism

```text
 [Agent A]                          [Agent B]
 (finishes)                          (starts)
     │                                  │
     ▼                                  ▼
 backup/ (old version) ──> handoff.md <── reads CLAUDE.md/AGENTS.md/copilot-instructions.md/…
 updates board & log        (single     │   (thin entrypoints)
 docs/handoff-log.md        source)    └─> verifies build/test → resumes work
```

---

## File Structure

```text
agent-handoff/
├── .github/
│   └── workflows/ci.yml       # CI: protocol validation on push
├── SKILL.md                   # The protocol (loaded by skills-capable agents)
├── README.md                  # This file (human-facing)
├── scripts/
│   └── validate-handoff.mjs   # --init / --check / --archive / --backup
├── references/
│   ├── handoff_log_format.md  # Log templates: normal, failure, backup/restore/split/takeover events
│   ├── best_practices.md      # Project-specific constraint template
│   └── taxonomy.md            # Clean software engineering folder classification guide
└── resources/
    ├── handoff.template.md    # ⭐ The single board template (init with this)
    ├── entrypoint.template.md # Generic thin-entrypoint template
    ├── CLAUDE.template.md     # Claude Code entrypoint
    ├── AGENTS.template.md     # Codex / general entrypoint
    ├── cursorrules.md         # Cursor entrypoint
    ├── windsurfrules.md       # Windsurf entrypoint
    ├── traerules.md           # Trae entrypoint
    ├── copilot-instructions.md# GitHub Copilot entrypoint
    └── README.template.md     # Human README + AI Agent Entrypoint section
```

---

## Setup & Installation

### Method 1: 🤖 Zero-Command AI Agent Auto-Initialization (Recommended)

If your AI Agent has this skill loaded (installed globally in `~/.gemini/config/skills/agent-handoff` or per-project in `.agents/skills/agent-handoff`), **simply ask the Agent to take over or initialize the project**.

When entering a new repository without `handoff.md`, the Agent will **autonomously**:
1. Create `handoff.md` from the single board template.
2. Infer project language and build/test commands (supports `pnpm`/`bun`/`yarn`/`npm`, `uv`/`poetry`/`pip`, `cargo`, `go`, `gradle`/`maven`, `cmake`/`make`).
3. Deploy thin entrypoints for your AI tools (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`, `.github/copilot-instructions.md`…).
4. Initialize `docs/handoff-log.md` with an initial log entry.

**Zero manual commands required from human developers.**

---

### Method 2: ⚡ One-Command CLI Auto-Bootstrapping

Run the auto-init command in your project directory:

```bash
cd /path/to/your/project
node /path/to/agent-handoff/scripts/validate-handoff.mjs --init
```

This single command auto-detects your project environment, creates `handoff.md`, `docs/handoff-log.md`, and all relevant thin entrypoint files automatically.

---

### Method 3: Manual Template Setup (Advanced)

```bash
# ① Copy the single board
cp resources/handoff.template.md /path/to/your/project/handoff.md

# ② Copy thin entrypoints for the agents you use
cp resources/CLAUDE.template.md /path/to/your/project/CLAUDE.md      # Claude Code
cp resources/AGENTS.template.md /path/to/your/project/AGENTS.md      # Codex / general
cp resources/cursorrules.md    /path/to/your/project/.cursorrules    # Cursor
cp resources/windsurfrules.md  /path/to/your/project/.windsurfrules  # Windsurf
cp resources/traerules.md      /path/to/your/project/.traerules      # Trae
mkdir -p /path/to/your/project/.github
cp resources/copilot-instructions.md /path/to/your/project/.github/copilot-instructions.md # Copilot
```

---

## Tooling

```bash
# Auto-Init: Automatically detect & initialize handoff board & entrypoints
node scripts/validate-handoff.mjs --init

# Validate: board structure, multi-board detection, link integrity, root cleanliness, backups
node scripts/validate-handoff.mjs --check

# Archive old log entries (>10) into docs/handoff-log-archive.md
node scripts/validate-handoff.mjs --archive

# Manually back up handoff.md & log to backup/
node scripts/validate-handoff.mjs --backup
```

---

## License

MIT License.

---

## 简体中文

# AgentHandoff — AI Agent 项目接管与进度无缝交接协议

## 架构与核心原则 (v3.0.2)

传统方案为每个平台维护各自的看板文件（`CLAUDE.md` / `README.md` / `.cursorrules` 等），极易产生**看板分裂**：Agent A 更新它的文件、Agent B 更新另一个文件，状态逐渐分叉。

AgentHandoff v3.0.2 采用核心治理原则解决此问题：

| 原则 | 传统多看板模式 | AgentHandoff (v3.0.2) |
|:---|:---|:---|
| **单一事实来源** | 多个看板并存 | **只有 `handoff.md`**，所有 Agent 共用一个看板 |
| **薄入口** | 平台文件内嵌完整看板 | 平台文件只是路牌（"读 `handoff.md`"），**零项目数据** |
| **版本备份** | 无 | 每次修改前把旧版备份到 `backup/`（永不删除） |
| **统一日志** | 日志内嵌在各看板 | 所有会话统一记录到 `docs/handoff-log.md`（归档不删除） |
| **完整任务生命周期** | 只有做完/未做 | 支持 `[ ]` 待办、`[/]` 进行中、`[x]` 完成、`[!]` 阻塞/挂起、`[~]` 取消/废弃 |
| **全技术栈智能推导** | 固定 npm 猜测 | 细粒度识别 lockfile：`pnpm`/`bun`/`yarn`/`npm`、`uv`/`poetry`、`cargo`、`go`、`mvn`/`gradle`、`cmake`/`make` |

另有：**智能自主初始化**——全新项目无 `handoff.md` 时，Agent 进入项目自动建置看板与精准推导构建命令，人类开发者零命令干预；**智能拆分**——`handoff.md` 超过 200 行时，AI 将详情拆到 `docs/` 子文件；**中断接管自愈**——接管异常中断的半成品任务并规范对齐。

## 核心机制

```text
 [Agent A]                          [Agent B]
 (结束)                              (开始)
     │                                  │
     ▼                                  ▼
 backup/（旧版）──> handoff.md <── 读 CLAUDE.md/AGENTS.md/copilot-instructions.md/…
 更新看板与日志      （单一事实       （薄入口）
 docs/handoff-log.md  来源）  └─> 跑 build/test 验证 → 直接接手
```

## 安装与初始化

### 方式一：🤖 AI Agent 零命令自主接管（推荐）

只要 AI Agent 加载了本 Skill（全局安装于 `~/.gemini/config/skills/agent-handoff` 或项目内 `.agents/skills/agent-handoff`），在进入无 `handoff.md` 的全新项目时：

**Agent 会自动自主触发初始化**：
1. 自动从模版生成 `handoff.md`。
2. 自动检测技术栈（支持 `pnpm`、`bun`、`yarn`、`npm`、`uv`、`poetry`、`cargo`、`go`、`gradle`、`maven`、`cmake`、`make`）并推导准确的编译测试命令。
3. 自动部署薄入口文件（`CLAUDE.md` / `.cursorrules` / `AGENTS.md` / `.traerules` / `.windsurfrules` / `.github/copilot-instructions.md`）。
4. 自动生成 `docs/handoff-log.md` 并写入首条初始化日志。

**人类开发者无需输入任何 `cp` 命令。**

---

### 方式二：⚡ 一键命令智能初始化 CLI

在项目目录下执行：

```bash
node /path/to/agent-handoff/scripts/validate-handoff.mjs --init
```

该命令会自动感知项目环境，一键建置 `handoff.md`、`docs/handoff-log.md` 与全部检测到的薄入口文件。

---

### 方式三：传统手动复制（高级自定义）

```bash
# ① 复制唯一看板模板
cp resources/handoff.template.md /path/to/your/project/handoff.md

# ② 按需复制薄入口文件
cp resources/CLAUDE.template.md /path/to/your/project/CLAUDE.md
cp resources/AGENTS.template.md /path/to/your/project/AGENTS.md
cp resources/cursorrules.md    /path/to/your/project/.cursorrules
cp resources/windsurfrules.md  /path/to/your/project/.windsurfrules
cp resources/traerules.md      /path/to/your/project/.traerules
mkdir -p /path/to/your/project/.github
cp resources/copilot-instructions.md /path/to/your/project/.github/copilot-instructions.md
```

## 工具命令

```bash
node scripts/validate-handoff.mjs --init      # 智能自动初始化当前项目
node scripts/validate-handoff.mjs --check     # 校验看板结构/多看板检测/引用/根目录整洁/备份
node scripts/validate-handoff.mjs --archive   # 归档超过 10 条的旧日志
node scripts/validate-handoff.mjs --backup    # 手动备份看板与日志
```

## 开源协议

MIT License.
