#!/usr/bin/env node
/**
 * Minimal repository smoke check to ensure required legal assets remain present.
 */
const fs = require('fs');
const path = require('path');

const requiredFiles = ['LICENSE.md', 'paywaz-license', 'README.md', 'SECURITY.md'];

function ensureFileExists(filename) {
  const filePath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required file: ${filename}`);
  }
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) {
    throw new Error(`Expected ${filename} to be a file`);
  }
}

try {
  requiredFiles.forEach(ensureFileExists);
  console.log('All required legal and documentation files are present.');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
