const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function fileExistsCaseSensitive(target) {
  // Verify each path segment exists with same case
  const parts = path.relative(root, target).split(path.sep);
  let cur = root;
  for (const p of parts) {
    if (!fs.existsSync(cur)) return false;
    const entries = fs.readdirSync(cur);
    const match = entries.find(e => e === p);
    if (!match) return false;
    cur = path.join(cur, p);
  }
  return true;
}

function resolveImport(fromFile, importPath) {
  const baseDir = path.dirname(fromFile);
  const cand = path.resolve(baseDir, importPath);
  const exts = ['', '.js', '.jsx', '.ts', '.tsx'];
  for (const e of exts) {
    const full = cand + e;
    if (fs.existsSync(full)) return full;
  }
  // check index files
  for (const e of exts) {
    const full = path.join(cand, 'index' + e);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

const AllFiles = walk(src).filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
const importRegex = /from\s+['\"](\.\.?\/[^'\"]+)['\"]/g;

const mismatches = [];
for (const file of AllFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    const imp = m[1];
    const resolved = resolveImport(file, imp);
    if (!resolved) continue; // couldn't resolve, maybe external or missing
    const targetRelative = path.relative(root, resolved);
    const expectedPath = path.join(root, targetRelative);
    if (!fileExistsCaseSensitive(expectedPath)) {
      mismatches.push({ from: file, importPath: imp, resolved: resolved });
    }
  }
}

if (mismatches.length === 0) {
  console.log('No case-sensitive mismatches detected.');
  process.exit(0);
}

console.log('Detected mismatches:', mismatches.length);
for (const mm of mismatches) {
  console.log('- file:', mm.from);
  console.log('  import:', mm.importPath);
  console.log('  resolves to:', mm.resolved);
}

process.exit(0);
