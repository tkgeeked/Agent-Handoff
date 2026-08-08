---
name: agent-handoff
slug: agent-handoff
displayName: AgentHandoff | AI Agent 项目接管与进度无缝交接协议
version: 3.0.1
author: tkgeeked
homepage: https://github.com/tkgeeked/agent-handoff
description: 统一交接看板（handoff.md）+ 智能自主初始化 + 薄入口 + 版本备份 + 智能拆分 + 统一日志。任何 AI Agent（Claude Code、Codex、Antigravity、Trae、Cursor、Windsurf 等）进入全新项目时，若不存在 handoff.md，将自动自主触发初始化并推导项目构建命令，实现真正零人工干预的无缝换 Agent 治理。(Use when starting or completing an agent coding session, auto-initializing handoff state in a project, handing off work between agents, inspecting project task boards, creating session logs, or backing up handoff state.)
---

# AgentHandoff | AI Agent 项目接管与进度无缝交接协议

> [!IMPORTANT]
> **项目根目录的 `handoff.md` 是唯一交接看板（单一事实来源）。**
> 所有 AI Agent 只能读写它和 `docs/handoff-log.md`；**禁止**在平台入口文件（`CLAUDE.md`、`AGENTS.md`、`.cursorrules`、`.windsurfrules`、`.traerules` 等）中记录任何项目进度、规范或日志。

## 0. 入口文件（薄入口，只做导向）

各平台入口文件**只包含一句话指令**："读取并维护根目录 `handoff.md`，禁止在本文件记录项目数据"。对应关系：

- Claude Code → `CLAUDE.md`
- Codex / Antigravity → `AGENTS.md`（或 `.agents/skills/` 中的本 SKILL）
- Cursor → `.cursorrules`
- Windsurf → `.windsurfrules`
- Trae → `.traerules`
- 其他 Agent → `README.md` 的 `AI Agent Entrypoint` 段落

## 1. 接管协议（每次会话开始时执行，按顺序不可跳过）

0. **智能自主初始化（全新项目自动触发）**：
   - 检查根目录是否存在 `handoff.md`。若不存在，Agent **无需等待人类命令，自主执行初始化**：
     a. 从本 Skill 的 `resources/handoff.template.md` 复制并在根目录创建 `handoff.md`。
     b. 扫描项目特征（`package.json` / `pyproject.toml` / `Cargo.toml` / `go.mod` 等），自动识别项目名称与默认构建/测试命令，填入 `handoff.md`。
     c. 根据当前运行平台自动创建对应薄入口文件（Claude Code 创建 `CLAUDE.md`，Cursor 创建 `.cursorrules`，Codex/Antigravity 创建 `AGENTS.md`，Trae 创建 `.traerules`，Windsurf 创建 `.windsurfrules`）。
     d. 创建 `docs/handoff-log.md` 并写入首条初始化日志（`### YYYY-MM-DD (项目初始化)`），随后继续执行步骤 1。
1. **读取看板**：读取根目录 `handoff.md`（这是项目唯一索引，**禁止 `find` 全树扫描**，按需打开索引中引用的文件）。
2. **验证实际状态**：执行项目的构建和测试命令，确认实际状态与看板一致。若不一致，以实际代码为准并更新看板。
3. **读取日志**：查看 `docs/handoff-log.md` 最近 3-5 条记录，重点关注"接班任务"和"已知问题"。
4. **声明会话范围**：明确本次会话计划完成哪些任务。若范围过大，裁剪并记录。

## 2. 目录整洁规范

- 根目录只允许：`handoff.md`、`README.md`、平台薄入口文件、`docs/`、`backup/`、`archive/`、`.scratch/`，以及项目自身的源码目录与构建配置文件。
- **新增文件必须归位到对应子目录**，并在 `handoff.md` 的「文档索引」区登记；禁止在根目录散落游离文件。
- 文件分类参考 `references/taxonomy.md`（语义化命名、归档优先、稳定优先）。
- 临时/调试文件放 `.scratch/`（已 gitignore），会话结束前清理。

## 3. 开发中维护

- 任务状态变化时 → 实时更新（`[ ]` → `[/]` → `[x]`）。
- 文件/目录增删、移动或重构时 → 立即同步 `handoff.md` 的「文档索引」区（引用同步，防止失效链接）。
- 做出重要技术决策时 → 同步更新「重要决策」区域（未拆分时在看板内，已拆分时写入 `docs/decisions.md`）。

## 4. 会话交接协议（每次会话结束前执行，按顺序不可跳过）

1. **先备份旧版**：在修改 `handoff.md` / `docs/handoff-log.md` **之前**，将当前（旧）版本复制到 `backup/handoff/` 与 `backup/log/`（命名带时间戳，见第 5 节）。备份动作本身追加一条日志。
2. **验证代码**：确保代码能编译、测试通过。若无法修复，按失败模板记录（见 `references/handoff_log_format.md`）。
3. **更新看板**：更新 `handoff.md` 任务表与当前状态。
4. **追加日志**：向 `docs/handoff-log.md` 追加一条交接记录（格式见 `references/handoff_log_format.md`，必须包含本次会话改动文件清单）。
5. **提交代码**：若涉及 git，使用 conventional commits（`feat:` / `fix:` / `docs:` 等）。未完成的半成品使用 WIP commit 并注明。
6. **总结**：向用户简要总结本次交接要点。

## 5. 备份机制

- 备份目录：`backup/handoff/`（看板历史）与 `backup/log/`（日志历史）。
- 命名规则：`handoff-YYYY-MM-DD-HHmm.md` / `log-YYYY-MM-DD-HHmm.md`（时间戳精确到分钟）。
- 备份内容：**修改前的完整旧版**，覆盖"误删"与"错误修改清空"两类恢复场景。
- 保留策略：**全部保留、永不删除**（backup 的定位是"可恢复"，与 archive 的"沉底"区分）。
- 恢复流程：若 `handoff.md` 内容异常（被清空/损坏），从 `backup/handoff/` 取最近一份旧版恢复，并在日志中记录恢复事件。

## 6. 日志与归档规则

- **唯一日志文件**：`docs/handoff-log.md`，逆序排列（最新在上），方便快速回看。
- 看板/日志中最多保留最近 10 条日志；超出时，将**最早**的记录移入 `docs/handoff-log-archive.md`（追加到末尾，保持时间顺序，永不删除）。
- 归档操作可用 `node scripts/validate-handoff.mjs --archive` 自动完成。
- 「重要决策记录」区域**永不归档**，永久保留。

## 7. 智能拆分（长期项目防冗长）

当 `handoff.md` 超过 200 行，或单一分区超过 40 行时，AI 应在会话结束维护时评估拆分：

| 原分区 | 拆到 | handoff.md 中保留 |
|--------|------|-------------------|
| 规范/约束细节 | `docs/rules.md` | 1 行链接 + 1 句摘要 |
| 目录结构树 | `docs/structure.md` | 1 行链接 + 1 句放置原则 |
| 重要决策详情 | `docs/decisions.md` | 链接（永久保留） |
| 用户偏好 | **永不拆分** | 留在看板（用户私有，内容短） |

拆分动作规范：创建子文件 → `handoff.md` 原位置替换为链接 → 更新「文档索引」区 → 在 `docs/handoff-log.md` 追加一条"拆分"事件。**拆分后的 `handoff.md` 必须仍能独立回答"项目是什么、进行到哪、下一步干什么"。**

子文件（`docs/rules.md` 等）只装静态内容，**禁止**出现任务表或会话日志，防止看板再次分裂。

## 8. 任务看板格式

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

## 9. 用户偏好（由用户填写，所有 Agent 遵守）

`handoff.md` 中应包含「用户偏好」区域，记录：
- 沟通语言偏好
- 操作权限边界（如：删除文件前必须确认 / 可自主决定）
- 代码风格偏好（如：保守修改 / 允许重构）
- 其他用户明确提出的规矩

此区域内容由用户定义，Agent **只读取、不擅自修改**。

## 10. 并行协作注意事项

- 若发现看板中有其他 Agent 正在进行的任务（标记为 `[/]` 且注明了执行者），不要修改该任务涉及的文件。
- 若必须修改同一文件，在日志中明确标注潜在冲突点。
- 大型项目建议按模块拆分任务，减少并行冲突。

## 11. 机械化校验与辅助工具

项目提供了轻量级校验、自动归档与手动备份工具：

```bash
# 智能自动初始化当前项目
node scripts/validate-handoff.mjs --init

# 校验 handoff.md 结构、多看板检测、引用完整性、根目录整洁度、备份存在性
node scripts/validate-handoff.mjs --check

# 当 docs/handoff-log.md 超过 10 条时，自动归档旧日志
node scripts/validate-handoff.mjs --archive

# 手动备份 handoff.md 与 docs/handoff-log.md 到 backup/
node scripts/validate-handoff.mjs --backup
```
