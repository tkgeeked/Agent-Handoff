# 交接日志格式参考

本文件定义了开发日志的标准格式，包括正常完成和失败/异常两种情况。
日志**统一写入 `docs/handoff-log.md`**（逆序，最新在上；超 10 条由归档工具移入 `docs/handoff-log-archive.md`）。

---

## 正常完成模板

```markdown
### YYYY-MM-DD HH:mm (会话交接摘要)
- **执行 Agent**：[例如 Claude Code, Codex, Cursor 等]
- **会话目标**：本次会话计划完成的任务。
- **改动文件清单**：修改/新增/删除的**所有**文件（路径级，方便回看与恢复）。
- **具体改动**：实现的功能或修复的问题。
- **技术决策**：关键实现思路、折中考量、新增依赖。
- **项目现状**：构建状态（通过/失败）、测试状态。
- **接班任务**：明确留给下一个 Agent 的具体待办事项。
```

---

## 失败/未完成模板

当会话目标未能全部完成时，**必须**使用此模板而非隐瞒问题：

```markdown
### YYYY-MM-DD HH:mm (会话交接摘要 - ⚠️ 未完成)
- **执行 Agent**：[Agent 名称]
- **会话目标**：原计划完成的任务。
- **完成情况**：已完成的部分 / 未完成的部分。
- **改动文件清单**：[本次所有文件改动，即使未完成也要列出]
- **失败原因**：
  - 尝试过的方案：[列出尝试了哪些方法]
  - 失败表现：[具体的报错信息或异常行为]
  - 疑似根因：[你对问题根源的判断]
- **已排除的方向**：[哪些可能性已经被排除，下一个 Agent 不必重复尝试]
- **建议下一步**：[你认为下一个 Agent 应该从哪里入手]
- **项目现状**：当前代码是否能编译/运行？是否有半成品代码需要注意？
```

---

## 发现前人问题模板

当你发现上一个 Agent 的决策或代码存在问题时：

```markdown
### YYYY-MM-DD HH:mm (会话交接摘要)
- **执行 Agent**：[Agent 名称]
- **发现的问题**：
  - 问题描述：[具体是什么问题]
  - 涉及文件：[哪些文件/模块受影响]
  - 来源判断：[哪个会话/决策引入的]
- **处理方式**：
  - [ ] 已直接修复（修复内容：...）
  - [ ] 标注存疑，等待用户确认（原因：...）
- **其余正常改动**：[本次会话的其他工作]
```

---

## 特殊事件模板

### 备份事件（每次修改看板/日志前发生，自动或手动）

```markdown
### YYYY-MM-DD HH:mm (备份)
- **动作**：备份 `handoff.md` / `docs/handoff-log.md` 旧版到 `backup/handoff/`、`backup/log/`
- **原因**：会话交接前例行备份 / 手动 `--backup`
```

### 恢复事件（看板异常时）

```markdown
### YYYY-MM-DD HH:mm (恢复)
- **动作**：从 `backup/handoff/handoff-XXXX-XX-XX-XXXX.md` 恢复 `handoff.md`
- **原因**：[文件被误删 / 被错误修改清空]
- **恢复后状态**：[一句话说明当前看板是否完整]
```

### 拆分事件（handoff.md 智能拆分时）

```markdown
### YYYY-MM-DD HH:mm (拆分)
- **动作**：将 `handoff.md` 的 [规范/目录树/决策] 拆分为 `docs/rules.md` / `docs/structure.md` / `docs/decisions.md`
- **原因**：看板超过阈值（>200 行 / 单分区 >40 行）
- **结果**：handoff.md 中保留链接 + 摘要，文档索引已同步
```

---

## Git 提交规范

| 场景 | commit 格式 | 示例 |
|------|-------------|------|
| 新功能完成 | `feat: 描述` | `feat: add user authentication` |
| 修复 bug | `fix: 描述` | `fix: resolve login redirect loop` |
| 文档更新 | `docs: 描述` | `docs: update handoff log` |
| 重构 | `refactor: 描述` | `refactor: extract auth middleware` |
| 未完成的工作 | `wip: 描述` | `wip: payment module half-done, see dev log` |
| 交接日志更新 | `docs: handoff log YYYY-MM-DD` | `docs: handoff log 2026-08-08` |

### 原则

- 每次会话结束前**必须** commit（哪怕是 WIP）。
- 不要留下未提交的修改让下一个 Agent 猜测。
- 交接日志的更新可以作为独立 commit，也可以和功能代码合并为一次 commit。

---

## 归档操作说明

当 `docs/handoff-log.md` 中的日志超过 10 条时：

1. 找到 `docs/handoff-log-archive.md`（若不存在则创建）。
2. 将日志中**最早**的记录剪切到归档文件的**末尾**（保持时间顺序）。
3. 在归档文件顶部保留标题：`# 开发日志归档`。
4. 日志文件只保留最近 10 条。
5. 此操作可用 `node scripts/validate-handoff.mjs --archive` 自动完成，也可手动执行。
