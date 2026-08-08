# *[Project Title]*

*[2-3 句人类可读的项目介绍：目标、受众、解决的问题]*

---

## 🤖 AI Agent Entrypoint

> 本项目采用 **AgentHandoff v2 协议**。AI Agent 请按以下步骤进入项目（不要以本文件为看板）：

1. 读取根目录 **`handoff.md`** —— 它是项目**唯一交接看板**（项目简介、任务、规范索引、接手指引都在里面）。
2. 按 `handoff.md` 的「接手指引」执行：先运行构建/测试验证实际状态，再读取 `docs/handoff-log.md` 最近 3-5 条日志。
3. 工作期间与结束时：**只维护** `handoff.md` 与 `docs/handoff-log.md`（结束前先备份旧版到 `backup/`）；**禁止**将项目进度写入 `CLAUDE.md`、`AGENTS.md`、`.cursorrules` 等平台入口文件。

---

## 🛠 环境与命令

- **构建**: `[e.g., npm run build]`
- **运行**: `[e.g., npm run dev]`
- **测试**: `[e.g., npm test]`
- **校验交接文档**: `node scripts/validate-handoff.mjs --check`（若项目安装了 agent-handoff 脚本）

## 📄 常用文档

- `handoff.md` — 唯一交接看板（AI 必读）
- `docs/handoff-log.md` — 开发日志（所有会话记录）
- `docs/rules.md` / `docs/structure.md` / `docs/decisions.md` — 拆分后的详细规范/目录/决策（可选）
- `backup/handoff/`、`backup/log/` — 看板与日志的历史备份
