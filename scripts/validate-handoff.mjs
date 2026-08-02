#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

/**
 * AgentHandoff Protocol Validator & Log Archiver
 * Usage:
 *   node scripts/validate-handoff.mjs --check
 *   node scripts/validate-handoff.mjs --archive
 */

const cwd = process.cwd();
const isArchiveMode = process.argv.includes('--archive');
const isCheckMode = process.argv.includes('--check') || !isArchiveMode;

console.log('🔍 AgentHandoff Validation & Maintenance Tool');
console.log('--------------------------------------------------');

// Find handoff document
const candidateFiles = ['CLAUDE.md', 'AI.md', 'README.md', 'SKILL.md'];
let targetFile = null;

for (const name of candidateFiles) {
  const fullPath = path.join(cwd, name);
  if (fs.existsSync(fullPath)) {
    targetFile = fullPath;
    break;
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

// 2. Count Dev Log Entries
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

// 3. Auto-archive if requested
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

// 4. Report Validation Results
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
