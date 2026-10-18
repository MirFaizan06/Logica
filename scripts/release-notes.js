// Prints the CHANGELOG.md section for one version, for use as GitHub release notes.
// Usage: node scripts/release-notes.js 1.2.0
const fs = require('node:fs');
const path = require('node:path');

const version = (process.argv[2] || '').replace(/^v/, '');
if (!version) {
  console.error('Usage: node scripts/release-notes.js <version>');
  process.exit(1);
}

const text = fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.md'), 'utf8');
const lines = text.split(/\r?\n/);
const heading = new RegExp(`^##\\s+\\[?${version.replace(/\./g, '\\.')}\\]?(\\s|$)`);
const start = lines.findIndex((l) => heading.test(l));
if (start === -1) {
  console.error(`CHANGELOG.md has no section for ${version}.`);
  process.exit(1);
}
let end = lines.findIndex((l, i) => i > start && /^##\s/.test(l));
if (end === -1) end = lines.length;

const body = lines.slice(start + 1, end).join('\n').trim();
if (!body) {
  console.error(`The CHANGELOG.md section for ${version} is empty.`);
  process.exit(1);
}
process.stdout.write(body + '\n');
