// Checks that a release tag, package.json, CHANGELOG.md and the in-app changelog all agree.
// Usage: node scripts/check-release.js v1.2.0
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const tag = process.argv[2] || '';
const version = tag.replace(/^v/, '');
const problems = [];

if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
  problems.push(`"${tag}" is not a version tag like v1.2.3.`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const pkgBase = pkg.version.replace(/-.*$/, '');
const tagBase = version.replace(/-.*$/, '');
if (pkgBase !== tagBase) {
  problems.push(`package.json says ${pkg.version} but the tag is ${tag}. Bump the version and tag again.`);
}

const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
if (!new RegExp(`^##\\s+\\[?${version.replace(/\./g, '\\.')}\\]?`, 'm').test(changelog)) {
  problems.push(`CHANGELOG.md has no "## [${version}]" section.`);
}

if (!/-/.test(version)) {
  const inApp = fs.readFileSync(path.join(root, 'src', 'content', 'changelog.ts'), 'utf8');
  if (!inApp.includes(`version: '${version}'`)) {
    problems.push(`src/content/changelog.ts has no entry for ${version} (it feeds the "What's new" sheet).`);
  }
}

if (problems.length) {
  console.error('Release check failed:');
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log(`Release check passed for ${tag}.`);
