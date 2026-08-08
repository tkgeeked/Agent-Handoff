#!/usr/bin/env node
/**
 * AgentHandoff — Validator, Archiver, Backup & Auto-Init Tool
 *
 * 用法:
 *   node scripts/validate-handoff.mjs --init     # 智能自动初始化当前项目（生成 handoff.md、日志与薄入口）
 *   node scripts/validate-handoff.mjs --check    # 校验 handoff.md 结构、多看板检测、引用完整性、根目录整洁度、备份存在性
 *   node scripts/validate-handoff.mjs --archive  # 归档 docs/handoff-log.md 中超过 10 条的旧日志
 *   node scripts/validate-handoff.mjs --backup   # 手动备份 handoff.md 与 docs/handoff-log.md 到 backup/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const resourcesDir = path.resolve(scriptDir, '..', 'resources');

const args = process.argv.slice(2);
const isInitMode = args.includes('--init');
const isArchiveMode = args.includes('--archive');
const isBackupMode = args.includes('--backup');
const isCheckMode = args.includes('--check') || (!isInitMode && !isArchiveMode && !isBackupMode);

// 支持 --root <path> 指定目标项目目录
let cwd = process.cwd();
const rootArgIdx = args.findIndex(arg => arg === '--root');
if (rootArgIdx !== -1 && args[rootArgIdx + 1]) {
  cwd = path.resolve(args[rootArgIdx + 1]);
}

const MAX_LOG_ENTRIES = 10;

// 根目录允许的入口/交接类文件（白名单）；项目自身源码与配置文件不在检查范围
const ALLOWED_ROOT_MD = new Set([
  'handoff.md', 'README.md', 'CLAUDE.md', 'AGENTS.md', 'AI.md',
]);

// 平台入口文件（薄入口）
const ENTRYPOINT_FILES = [
  'CLAUDE.md', 'AGENTS.md', 'AI.md', 'README.md',
  '.cursorrules', '.windsurfrules', '.traerules',
];

console.log('🔍 AgentHandoff Validation & Maintenance Tool');
console.log('--------------------------------------------------');

// ---------- 0. 智能自主初始化 (--init) ----------
if (isInitMode) {
  const handoffPath = path.join(cwd, 'handoff.md');
  if (fs.existsSync(handoffPath)) {
    console.log('⚠️ 项目根目录已存在 handoff.md，无需重复初始化。');
    console.log('💡 运行 --check 可校验现有看板结构。');
    process.exit(0);
  }

  console.log('⚡ 开始智能自动初始化项目交接治理架构...');
  const projectName = path.basename(cwd);

  // 推导构建与测试命令
  let buildCmd = 'npm run build';
  let testCmd = 'npm test';
  let projectType = 'Node.js / Generic';

  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
      projectType = 'Node.js (package.json)';
      if (pkg.scripts?.build) buildCmd = 'npm run build';
      if (pkg.scripts?.test) testCmd = 'npm test';
    } catch {}
  } else if (fs.existsSync(path.join(cwd, 'pyproject.toml')) || fs.existsSync(path.join(cwd, 'requirements.txt'))) {
    projectType = 'Python';
    buildCmd = 'pip install -r requirements.txt';
    testCmd = 'pytest';
  } else if (fs.existsSync(path.join(cwd, 'Cargo.toml'))) {
    projectType = 'Rust';
    buildCmd = 'cargo build';
    testCmd = 'cargo test';
  } else if (fs.existsSync(path.join(cwd, 'go.mod'))) {
    projectType = 'Go';
    buildCmd = 'go build ./...';
    testCmd = 'go test ./...';
  }

  console.log(`📦 检测到项目类型: ${projectType}`);

  // 1. 初始化 handoff.md
  const handoffTemplatePath = path.join(resourcesDir, 'handoff.template.md');
  let handoffText = '';
  if (fs.existsSync(handoffTemplatePath)) {
    handoffText = fs.readFileSync(handoffTemplatePath, 'utf8');
  } else {
    handoffText = `# ${projectName} — 项目交接看板\n\n## 1. 项目简介\n- **目标**：${projectName} 核心项目\n\n## 2. 当前状态\n- **构建命令**：\`${buildCmd}\`\n- **测试命令**：\`${testCmd}\`\n\n## 3. 任务看板\n### 当前目标：初始化项目开发\n\n| 任务 | 优先级 | 状态 | 前置依赖 | 备注 |\n|------|--------|------|----------|------|\n| 完成初始化 | P0 | [x] | 无 | 由 AgentHandoff 智能建置 |\n\n## 4. 文档索引\n- \`docs/handoff-log.md\`: 开发日志\n\n## 5. 用户偏好\n- 语言偏好：中文\n\n## 6. 接手指引\n接手时先跑测试，确认逻辑符合预期。\n`;
  }

  // 替换模版中的占位符号
  handoffText = handoffText.replace(/\[一句话描述项目的核心功能与商业\/技术目标\]/g, `${projectName} 核心项目`);
  fs.writeFileSync(handoffPath, handoffText, 'utf8');
  console.log('✅ 已生成根目录唯一交接看板: handoff.md');

  // 2. 初始化 docs/handoff-log.md
  const docsDir = path.join(cwd, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  const logPath = path.join(docsDir, 'handoff-log.md');
  if (!fs.existsSync(logPath)) {
    const today = new Date().toISOString().split('T')[0];
    const initialLog = `# 开发日志 (Development Log)\n\n### ${today} (项目智能初始化)\n- **执行 Agent**：AgentHandoff Auto-Init\n- **会话目标**：自动建置项目交接治理看板与薄入口。\n- **改动文件清单**：\`handoff.md\`, \`docs/handoff-log.md\`, 薄入口文件\n- **具体改动**：生成单一事实来源看板与项目日志结构。\n- **项目现状**：构建状态（通过 ✅）。\n- **接班任务**：配置项目专属代码规范与用户偏好。\n`;
    fs.writeFileSync(logPath, initialLog, 'utf8');
    console.log('✅ 已生成开发日志: docs/handoff-log.md');
  }

  // 3. 部署薄入口文件
  const entrypointMap = [
    { file: 'CLAUDE.md', tmpl: 'CLAUDE.template.md' },
    { file: 'AGENTS.md', tmpl: 'AGENTS.template.md' },
    { file: '.cursorrules', tmpl: 'cursorrules.md' },
    { file: '.windsurfrules', tmpl: 'windsurfrules.md' },
    { file: '.traerules', tmpl: 'traerules.md' },
  ];

  for (const { file, tmpl } of entrypointMap) {
    const filePath = path.join(cwd, file);
    if (!fs.existsSync(filePath)) {
      const tmplPath = path.join(resourcesDir, tmpl);
      if (fs.existsSync(tmplPath)) {
        fs.copyFileSync(tmplPath, filePath);
        console.log(`✅ 已自动创建平台薄入口: ${file}`);
      }
    }
  }

  console.log('--------------------------------------------------');
  console.log('🎉 智能初始化完成！AgentHandoff 治理协议已准备就绪。');
  process.exit(0);
}

// ---------- 定位目标看板/文档 ----------
let targetFile = null;
const fileArgIdx = args.findIndex(arg => arg === '--file' || arg === '-f');
if (fileArgIdx !== -1 && args[fileArgIdx + 1]) {
  const resolved = path.resolve(cwd, args[fileArgIdx + 1]);
  if (fs.existsSync(resolved)) targetFile = resolved;
}

if (!targetFile) {
  const handoffPath = path.join(cwd, 'handoff.md');
  if (fs.existsSync(handoffPath)) {
    targetFile = handoffPath;
  }
}

if (!targetFile) {
  console.error('❌ 未找到唯一交接看板 handoff.md。');
  console.error('   运行 node scripts/validate-handoff.mjs --init 即可一键智能自动初始化。');
  process.exit(1);
}
console.log(`📄 校验交接文档: ${path.relative(cwd, targetFile)}`);

const warnings = [];
const errors = [];

// ---------- 1. 校验看板结构 ----------
const handoffContent = fs.readFileSync(targetFile, 'utf8');

// 1a. 必要章节
const requiredSections = ['项目简介', '当前状态', '当前目标', '任务表', '文档索引', '用户偏好', '接手指引'];
for (const section of requiredSections) {
  if (!handoffContent.includes(section)) {
    warnings.push(`handoff.md 缺少必要章节：「${section}」`);
  }
}

// 1b. 任务表语法
const taskLines = handoffContent.split('\n').filter(line => line.includes('|'));
if (taskLines.length > 0) {
  let taskCount = 0;
  for (const line of taskLines) {
    if (/^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(line)) continue;
    const statusMatch = line.match(/\[([ x/!?\-])\]/i);
    if (statusMatch) {
      taskCount++;
      const statusSymbol = statusMatch[1].toLowerCase();
      if (![' ', '/', 'x'].includes(statusSymbol)) {
        warnings.push(`非标准任务状态 '[${statusMatch[1]}]'：${line.trim()}`);
      }
    }
    const priorityMatch = line.match(/\b(P[0-9]|HIGH|MEDIUM|LOW)\b/i);
    if (priorityMatch && !['P0', 'P1', 'P2'].includes(priorityMatch[1].toUpperCase())) {
      warnings.push(`非标准任务优先级 '${priorityMatch[1]}'：${line.trim()}`);
    }
  }
  if (taskCount > 0) console.log(`📋 已检查 ${taskCount} 条任务看板项`);
}

// 1c. 看板行数（智能拆分阈值提示）
const handoffLines = handoffContent.split('\n').length;
if (handoffLines > 200) {
  warnings.push(`handoff.md 已达 ${handoffLines} 行（>200），建议按协议第 7 节智能拆分（规范 → docs/rules.md 等）。`);
} else if (handoffLines > 120) {
  console.log(`ℹ️ handoff.md 当前 ${handoffLines} 行，接近拆分阈值（200 行）。`);
}

// ---------- 2. 多看板检测（防分裂） ----------
console.log('🔎 检查平台入口文件是否混入看板数据...');
for (const name of ENTRYPOINT_FILES) {
  const p = path.join(cwd, name);
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');
  const boardMarkers = [];
  if (/^\s*\|.*\[[ x/]\]/m.test(content)) boardMarkers.push('任务状态表格');
  if (/(?:^|\n)#+\s*(?:Session Handoff Log|开发日志|Development Log)/i.test(content)) boardMarkers.push('日志章节');
  if (/(?:^|\n)#+\s*(?:Active Task Tracker|任务表|Task Tracker)/i.test(content)) boardMarkers.push('任务表章节');
  if (boardMarkers.length > 0) {
    warnings.push(`⚠️ 入口文件 ${name} 疑似混入看板数据（${boardMarkers.join('、')}）。入口文件必须是纯导向，项目数据只能写 handoff.md 与 docs/handoff-log.md。`);
  }
}

// ---------- 3. 引用完整性（防孤儿文件/失效链接） ----------
console.log('🔎 校验 handoff.md 文档索引引用...');
const linkRegex = /!?\[[^\]]*\]\(([^)]+)\)/g;
let match;
const checkedRefs = new Set();
while ((match = linkRegex.exec(handoffContent)) !== null) {
  const target = match[1].trim();
  if (!target || target.startsWith('http://') || target.startsWith('https://') || target.startsWith('#')) continue;
  const cleanTarget = target.split('#')[0].split('?')[0];
  if (!cleanTarget || checkedRefs.has(cleanTarget)) continue;
  checkedRefs.add(cleanTarget);
  const fullPath = path.resolve(cwd, cleanTarget);
  if (!fs.existsSync(fullPath)) {
    const lineStart = handoffContent.lastIndexOf('\n', match.index) + 1;
    const lineEnd = handoffContent.indexOf('\n', match.index);
    const line = handoffContent.slice(lineStart, lineEnd === -1 ? handoffContent.length : lineEnd);
    if (line.includes('可选')) {
      console.log(`ℹ️ 可选引用尚未生成（拆分后创建）：${cleanTarget}`);
    } else {
      warnings.push(`handoff.md 引用了不存在的文件：${cleanTarget}`);
    }
  }
}
console.log(`🔗 已校验 ${checkedRefs.size} 条本地引用`);

// ---------- 4. 根目录整洁度检查 ----------
console.log('🔎 检查根目录整洁度...');
const rootEntries = fs.readdirSync(cwd, { withFileTypes: true });
const strayFiles = [];
for (const entry of rootEntries) {
  if (entry.name.startsWith('.') || entry.isDirectory()) continue;
  if (!/\.md$/i.test(entry.name)) continue;
  if (!ALLOWED_ROOT_MD.has(entry.name)) {
    strayFiles.push(entry.name);
  }
}
if (strayFiles.length > 0) {
  warnings.push(`根目录存在未归位的散落文档：${strayFiles.join('、')}。请移入对应子目录（见 references/taxonomy.md），并在 handoff.md 文档索引区登记。`);
} else {
  console.log(`✅ 根目录整洁（仅允许的入口文档）`);
}

// ---------- 5. 日志检查（docs/handoff-log.md） ----------
const logPath = path.join(cwd, 'docs', 'handoff-log.md');
let logEntries = [];
if (fs.existsSync(logPath)) {
  const logContent = fs.readFileSync(logPath, 'utf8');
  const entryMatches = Array.from(logContent.matchAll(/^###\s+.*$/gm));
  logEntries = entryMatches.map((m, idx) => ({
    header: m[0],
    start: m.index,
    end: idx < entryMatches.length - 1 ? entryMatches[idx + 1].index : logContent.length,
  }));
  console.log(`📊 docs/handoff-log.md 日志条目：${logEntries.length} / ${MAX_LOG_ENTRIES} max`);
  if (logEntries.length > MAX_LOG_ENTRIES) {
    warnings.push(`日志已 ${logEntries.length} 条（上限 ${MAX_LOG_ENTRIES}），运行 --archive 归档旧日志。`);
  }
} else {
  warnings.push('未找到 docs/handoff-log.md。会话结束后应在此文件追加交接记录。');
}

// ---------- 7. 归档模式 ----------
if (isArchiveMode && logEntries.length > MAX_LOG_ENTRIES) {
  const keepCount = MAX_LOG_ENTRIES;
  const keepEntries = logEntries.slice(0, keepCount);
  const archiveEntries = logEntries.slice(keepCount);

  const archiveDir = path.join(cwd, 'docs');
  const archiveFile = path.join(archiveDir, 'handoff-log-archive.md');
  let existingArchive = '';
  if (fs.existsSync(archiveFile)) {
    existingArchive = fs.readFileSync(archiveFile, 'utf8');
  } else {
    existingArchive = '# 开发日志归档\n\n（由 AgentHandoff 自动归档，只追加不删除。）\n\n';
  }

  const logContent = fs.readFileSync(logPath, 'utf8');
  const archiveText = archiveEntries
    .map(e => logContent.slice(e.start, e.end).trim())
    .join('\n\n');

  const keepText = keepEntries
    .map(e => logContent.slice(e.start, e.end).trim())
    .join('\n\n');
  fs.writeFileSync(logPath, keepText + '\n', 'utf8');

  fs.writeFileSync(archiveFile, existingArchive.trimEnd() + '\n\n' + archiveText + '\n', 'utf8');

  console.log(`✅ 已归档 ${archiveEntries.length} 条旧日志到 docs/handoff-log-archive.md`);
}

// ---------- 8. 备份模式（手动触发） ----------
if (isBackupMode) {
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;

  const sources = [
    { src: targetFile, dir: path.join(cwd, 'backup', 'handoff'), prefix: 'handoff' },
    { src: logPath, dir: path.join(cwd, 'backup', 'log'), prefix: 'log' },
  ];

  for (const { src, dir, prefix } of sources) {
    if (!fs.existsSync(src)) continue;
    fs.mkdirSync(dir, { recursive: true });
    const dest = path.join(dir, `${prefix}-${ts}.md`);
    fs.copyFileSync(src, dest);
    console.log(`✅ 已备份 ${path.relative(cwd, src)} → ${path.relative(cwd, dest)}`);
  }
  if (!isCheckMode) {
    console.log('💡 提示：备份动作应在日志中记录一条「备份事件」（见 references/handoff_log_format.md）。');
  }
}

// ---------- 9. 备份存在性检查（在所有动作之后执行） ----------
console.log('🔎 检查备份目录...');
const backupDirs = [path.join(cwd, 'backup', 'handoff'), path.join(cwd, 'backup', 'log')];
const backupLabels = ['看板备份', '日志备份'];
backupDirs.forEach((dir, i) => {
  if (fs.existsSync(dir) && fs.readdirSync(dir).some(f => !f.startsWith('.'))) {
    const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
    console.log(`✅ ${backupLabels[i]}存在（${files.length} 份历史）`);
  } else {
    warnings.push(`backup/${backupLabels[i] === '看板备份' ? 'handoff' : 'log'}/ 目录不存在或为空。每次修改 handoff.md / docs/handoff-log.md 前必须先备份旧版。`);
  }
});

// ---------- 10. 汇总 ----------
console.log('--------------------------------------------------');
if (errors.length > 0) {
  console.error('❌ 校验错误:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('⚠️ 校验建议:');
  warnings.forEach(w => console.log(`  - ${w}`));
  console.log('✅ 校验完成（存在可优化项）。');
} else {
  console.log('✅ 校验通过！AgentHandoff 协议结构完整。');
}
