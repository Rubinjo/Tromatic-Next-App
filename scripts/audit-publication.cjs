// Read-only heuristic scan. Reports locations/categories, never matched values.
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const git = (...args) => execFileSync('git', args, {maxBuffer: 256 * 1024 * 1024});
const rules = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['Google API key', /AIza[\w-]{35}/],
  ['GitHub token', /(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})/],
  ['AWS access key', /AKIA[A-Z0-9]{16}/],
  ['credential assignment', /(?:password|secret|accessToken|apiKey)\s*[=:]\s*["'][^"'\r\n]{8,}["']/i],
  ['email address', /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/],
];
let findings = 0, scanned = 0;
function scan(label, bytes) {
  if (bytes.includes(0)) return;
  scanned++;
  const content = bytes.toString('utf8');
  for (const [category, pattern] of rules) {
    if (pattern.test(content)) { console.log(`${category}: ${label}`); findings++; }
  }
}
if (process.argv.includes('--history')) {
  const objects = git('rev-list', '--objects', '--all').toString().trim().split('\n');
  const sizes = execFileSync('git', ['cat-file', '--batch-check=%(objectname) %(objecttype)'], {input: objects.map(x => x.split(' ')[0]).join('\n'), maxBuffer: 256 * 1024 * 1024}).toString().trim().split('\n');
  for (let i = 0; i < objects.length; i++) {
    if (!sizes[i].endsWith(' blob')) continue;
    const [oid, ...path] = objects[i].split(' ');
    scan(`${oid.slice(0, 12)} ${path.join(' ')}`, git('cat-file', 'blob', oid));
  }
} else {
  for (const file of git('ls-files', '-co', '--exclude-standard', '-z').toString().split('\0').filter(Boolean)) {
    if (fs.existsSync(file)) scan(file, fs.readFileSync(file));
  }
}
console.log(`Scanned ${scanned} text files/blobs; ${findings} heuristic findings requiring review.`);
console.log('This is not a security certification. Review binaries, history, metadata and scanner blind spots separately.');
process.exitCode = findings ? 1 : 0;
