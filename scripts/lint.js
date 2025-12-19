#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function getMarkdownFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    if (['node_modules', '.git'].includes(entry.name)) {
      return [];
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return getMarkdownFiles(fullPath);
    }
    return entry.name.endsWith('.md') ? [fullPath] : [];
  });
}

const mdFiles = getMarkdownFiles(process.cwd());

function hasTrailingWhitespace(content) {
  return content.split('\n').some((line) => {
    const trailingMatch = line.match(/\s+$/);
    if (!trailingMatch) return false;
    // Allow Markdown hard-breaks that intentionally end with two spaces.
    return trailingMatch[0] !== '  ';
  });
}

let hasError = false;

mdFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');

  if (hasTrailingWhitespace(content)) {
    console.error(`${filePath} contains trailing whitespace.`);
    hasError = true;
  }

  if (content.includes('\t')) {
    console.error(`${filePath} contains tab characters; use spaces instead.`);
    hasError = true;
  }
});

if (mdFiles.length === 0) {
  console.error('No Markdown files found to lint.');
  hasError = true;
}

if (hasError) {
  process.exit(1);
}

console.log('Markdown lint checks passed.');
