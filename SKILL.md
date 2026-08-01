---
name: agent-handoff
slug: agent-handoff
displayName: AgentHandoff | AI Agent 项目接管与进度无缝交接协议
version: 2.0.0
author: tkgeeked
homepage: https://github.com/tkgeeked/agent-handoff
description: 专为 AI Agent（包括 Claude Code、Codex、Antigravity、Trae 等）设计的项目治理与接管规范。通过自动维护的"活体看板"和"开发日志"，实现不同 AI 助手或多次会话之间的零信息差无缝交接开发。
---

# AgentHandoff 交接协议

> [!NOTE]
> **开源项目地址 (GitHub Repository)**: [tkgeeked/agent-handoff](https://github.com/tkgeeked/agent-handoff)

## 1. 接管协议（每次会话开始时执行）

按顺序执行，不可跳过：

1. **定位看板**：查找项目中的交接文档（优先级：`CLAUDE.md` → `AI.md` → `README.md` 中的 `AI Agent Entrypoint` 段落）。若不存在，使用 `resources/` 下的模板初始化。
2. **验证实际状态**：不要直接信任文档。执行项目的构建和测试命令，确认实际状态与文档记录一致。若不一致，以实际代码为准，并更新文档。
3. **读取任务看板**：查看当前进行中（`[/]`）和待办（`[ ]`）任务，确认本次会话的工作目标。
4. **读取最新日志**：只看最近 3-5 条开发日志，重点关注"接班任务"和"已知问题"。
5. **声明会话范围**：在开始编码前，明确本次会话计划完成哪些任务。若范围过大，裁剪并记录。

## 2. 开发中维护

- 文件/目录增删或重构时 → 立即更新看板中的目录结构树。
- 任务状态变化时 → 实时更新（`[ ]` → `[/]` → `[x]`）。
- 做出重要技术决策时 → 同步更新看板中的「重要决策记录」区域。

## 3. 会话交接协议（每次会话结束前执行）

按顺序执行，不可跳过：

1. 确保代码能编译通过，测试通过。若无法修复，按失败模板记录（见 `references/handoff_log_format.md`）。
2. 更新任务看板（标记完成项，添加新发现的待办）。
3. 向开发日志追加一条交接记录（格式见 `references/handoff_log_format.md`）。
4. 若涉及 git：提交代码，使用 conventional commits 格式（`feat:` / `fix:` / `docs:` 等）。未完成的半成品使用 WIP commit 并注明。
5. 向用户简要总结本次交接要点。

## 4. 日志归档规则

- 看板中的开发日志区域**最多保留最近 10 条**记录。
- 超出时，将最早的记录移入 `docs/dev-log-archive.md`（追加到该文件末尾，保持时间顺序）。
- 归档文件中不删除任何内容，只做追加。
- 「重要决策记录」区域**永不归档**，永久保留。

## 5. 任务看板格式

```markdown
### 当前目标：[一句话描述]

| 任务 | 优先级 | 状态 | 前置依赖 | 备注 |
|------|--------|------|----------|------|
| 任务描述 | P0/P1/P2 | [ ] [/] [x] | 依赖哪个任务 | 补充说明 |
```

优先级定义：
- **P0**：阻塞性问题，必须立即处理
- **P1**：重要，本次或下次会话应完成
- **P2**：普通，可排期

## 6. 用户偏好（由用户填写，所有 Agent 遵守）

看板中应包含一个「用户偏好」区域，记录：
- 沟通语言偏好
- 操作权限边界（如：删除文件前必须确认 / 可自主决定）
- 代码风格偏好（如：保守修改 / 允许重构）
- 其他用户明确提出的规矩

此区域内容由用户定义，Agent 只读取、不擅自修改。

## 7. 平台适配（原则 + 回退）

原则：每个项目必须有一个 AI 可读的交接文档。不同 Agent 的读取路径不同：

- Claude Code → `CLAUDE.md`
- Antigravity / Codex → `.agents/skills/` 中的 SKILL.md
- Trae / Cursor / Windsurf → `.traerules` / `.cursorrules` / `.windsurfrules`
- 其他 Agent → `README.md`（查找 `AI Agent Entrypoint`）或 `AI.md`

**回退规则**：如果你的 Agent 不在上述列表中，按以下顺序查找交接文档：`CLAUDE.md` → `AI.md` → `README.md`。找到即止。

## 8. 并行协作注意事项

- 若发现看板中有其他 Agent 正在进行的任务（标记为 `[/]` 且注明了执行者），不要修改该任务涉及的文件。
- 若必须修改同一文件，在日志中明确标注潜在冲突点。
- 大型项目建议按模块拆分任务，减少并行冲突。

## 9. 目录卫生

- 生产代码放标准源码目录（`src/`、`lib/`、`app/`）。
- 临时/调试文件放 `.scratch/`（已 gitignore），会话结束前清理。
- 根目录只放必要配置文件，保持干净。
