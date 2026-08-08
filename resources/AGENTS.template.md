# AGENTS.md（入口文件，非看板）

> 本项目采用 AgentHandoff 协议。**本文件只是入口，不是看板。**

## 唯一交接看板

项目的唯一交接看板是根目录的 **`handoff.md`**（单一事实来源）。项目进度、规范、任务状态、日志**只能**写入 `handoff.md` 与 `docs/handoff-log.md`，**禁止**写入本文件或任何其他平台文件。

## 每次会话必须执行

1. 读取根目录 `handoff.md`，按其中「接手指引」执行（先运行构建/测试验证实际状态，再读取 `docs/handoff-log.md` 最近 3-5 条日志）。
2. 工作期间：实时更新 `handoff.md` 任务表与文档索引。
3. 会话结束前（按顺序）：**先将修改前的旧版备份到 `backup/handoff/` 与 `backup/log/`** → 更新任务表 → 向 `docs/handoff-log.md` 追加交接记录（含改动文件清单）→ 提交代码。

详细协议见 AgentHandoff SKILL.md。
