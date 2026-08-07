#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

/**
 * AgentHandoff Protocol Validator & Log Archiver
 * Usage:
 *   node scripts/validate-handoff.mjs --check
 *   node scripts/validate-handoff.mjs --archive
 *   node scripts/validate-handoff.mjs --file <path-to-file>
 */

const cwd = process.cwd();
const args = process.argv.slice(2);

// Check CLI arguments for --file or -f
let customFilePath = null;
const fileArgIdx = args.findIndex(arg => arg === '--file' || arg === '-f');
if (fileArgIdx !== -1 && args[fileArgIdx + 1]) {
  customFilePath = args[fileArgIdx + 1];
} else {
  const inlineFileArg = args.find(arg => arg.startsWith('--file='));
  if (inlineFileArg) {
    customFilePath = inlineFileArg.split('=')[1];
  }
}

const isArchiveMode = args.includes('--archive');
const isCheckMode = args.includes('--check') || (!isArchiveMode && !customFilePath) || customFilePath !== null;

console.log('🔍 AgentHandoff Validation & Maintenance Tool');
console.log('--------------------------------------------------');

// Find handoff document
let targetFile = null;

if (customFilePath) {
  const resolved = path.resolve(cwd, customFilePath);
  if (fs.existsSync(resolved)) {
    targetFile = resolved;
  } else {
    console.error(`❌ Specified target file not found: ${customFilePath}`);
    process.exit(1);
  }
} else {
  const candidateFiles = ['CLAUDE.md', 'AI.md', 'README.md', 'SKILL.md'];
  for (const name of candidateFiles) {
    const fullPath = path.join(cwd, name);
    if (fs.existsSync(fullPath)) {
      targetFile = fullPath;
      break;
    }
  }
}

if (!targetFile) {
  console.log('⚠️ No primary handoff document (CLAUDE.md, AI.md, README.md, SKILL.md) found.');
  process.exit(0);
}

console.log(`📄 Target Handoff Document: ${path.relative(cwd, targetFile)}`);

const content = fs.readFileSync(targetFile, 'utf8');
const errors = [];
const warnings = [];

// 1. Validate Handoff Elements
if (!content.includes('SKILL') && !content.includes('Handoff') && !content.includes('Agent')) {
  warnings.push('Document does not appear to contain AgentHandoff protocol headers.');
}

// 2. Validate Task Board Markdown Table & Task States
const taskLines = content.split('\n').filter(line => line.includes('|'));
if (taskLines.length > 0) {
  let taskCount = 0;
  for (const line of taskLines) {
    // Skip table header divider lines (e.g. |---|---|)
    if (/^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(line)) continue;

    // Check for task status checkbox syntax in table cells
    const statusMatch = line.match(/\[([ x/!?\-])\]/i);
    if (statusMatch) {
      taskCount++;
      const statusSymbol = statusMatch[1].toLowerCase();
      if (![' ', '/', 'x'].includes(statusSymbol)) {
        warnings.push(`Non-standard task status symbol '[${statusMatch[1]}]' found in line: "${line.trim()}". Expected '[ ]', '[/]', or '[x]'.`);
      }
    }

    // Check for task priority syntax in table cells
    const priorityMatch = line.match(/\b(P[0-9]|HIGH|MEDIUM|LOW)\b/i);
    if (priorityMatch) {
      const p = priorityMatch[1].toUpperCase();
      if (!['P0', 'P1', 'P2'].includes(p)) {
        warnings.push(`Non-standard task priority '${priorityMatch[1]}' found in line: "${line.trim()}". Expected 'P0', 'P1', or 'P2'.`);
      }
    }
  }
  if (taskCount > 0) {
    console.log(`📋 Checked ${taskCount} task board item(s) for protocol compliance.`);
  }
}

// 3. Count Dev Log Entries
const logHeaderMatch = content.match(/## (?:开发日志|Development Log|Dev Log)/i);
let logEntries = [];
let preLogContent = content;
let postLogContent = '';

if (logHeaderMatch) {
  const logIndex = logHeaderMatch.index;
  preLogContent = content.slice(0, logIndex);
  const remaining = content.slice(logIndex);

  // Find next section header (e.g. ## User Preferences or similar)
  const nextSectionMatch = remaining.slice(logHeaderMatch[0].length).match(/\n## /);
  let logSectionText = remaining;
  if (nextSectionMatch) {
    const splitIdx = logHeaderMatch[0].length + nextSectionMatch.index;
    logSectionText = remaining.slice(0, splitIdx);
    postLogContent = remaining.slice(splitIdx);
  }

  // Parse log entries starting with ### [Date/Time/Version] or ### Entry
  const entryMatches = Array.from(logSectionText.matchAll(/###\s+.*(?=\n|$)/g));
  logEntries = entryMatches.map((m, idx) => {
    const start = m.index;
    const end = idx < entryMatches.length - 1 ? entryMatches[idx + 1].index : logSectionText.length;
    return logSectionText.slice(start, end).trim();
  });

  console.log(`📊 Active Dev Log Entries: ${logEntries.length} / 10 max`);

  if (logEntries.length > 10) {
    warnings.push(`Dev Log has ${logEntries.length} entries (recommended maximum is 10). Run with --archive to auto-archive older entries.`);
  }
} else {
  console.log('ℹ️ No active Dev Log section found in target file (normal for core protocol/template repos).');
}

// 4. Auto-archive if requested
if (isArchiveMode && logEntries.length > 10) {
  const keepEntries = logEntries.slice(0, 10);
  const archiveEntries = logEntries.slice(10);

  const archiveDir = path.join(cwd, 'docs');
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const archiveFile = path.join(archiveDir, 'dev-log-archive.md');
  let existingArchive = '';
  if (fs.existsSync(archiveFile)) {
    existingArchive = fs.readFileSync(archiveFile, 'utf8');
  } else {
    existingArchive = '# Development Log Archive\n\nArchived older entries from AgentHandoff active dashboard.\n\n';
  }

  const newArchiveText = existingArchive + '\n\n' + archiveEntries.join('\n\n') + '\n';
  fs.writeFileSync(archiveFile, newArchiveText, 'utf8');

  // Reconstruct target file
  const updatedLogSection = `## 开发日志 (Development Log)\n\n${keepEntries.join('\n\n')}\n\n`;
  const updatedContent = preLogContent + updatedLogSection + postLogContent;
  fs.writeFileSync(targetFile, updatedContent, 'utf8');

  console.log(`✅ Successfully archived ${archiveEntries.length} entries to docs/dev-log-archive.md`);
}

// 5. Report Validation Results
console.log('--------------------------------------------------');
if (errors.length > 0) {
  console.error('❌ Validation Errors:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('⚠️ Validation Advisories:');
  warnings.forEach(w => console.log(`  - ${w}`));
  console.log('✅ Validation completed with advisories.');
} else {
  console.log('✅ Validation passed! AgentHandoff protocol structure is clean.');
}
