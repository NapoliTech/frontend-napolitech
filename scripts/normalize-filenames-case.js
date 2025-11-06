const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');

function walk(dir) {
  const files = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function buildMapping(files) {
  const map = new Map();
  // Sort by depth desc to rename deeper files first
  files.sort((a,b) => b.split(path.sep).length - a.split(path.sep).length);
  for (const f of files) {
    const rel = path.relative(root, f);
    const targetRel = rel.split(path.sep).map(p => p.toLowerCase()).join(path.sep);
    if (rel !== targetRel) {
      const from = f;
      const to = path.join(root, targetRel);
      map.set(from, to);
    }
  }
  return map;
}

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function applyRenames(map) {
  // If any target path already exists and is not same as source, we fail
  for (const [from, to] of map.entries()) {
    if (fs.existsSync(to) && path.resolve(from) !== path.resolve(to)) {
      console.error('Target already exists, aborting to avoid overwrite:', to);
      process.exit(1);
    }
  }

  for (const [from, to] of map.entries()) {
    ensureDirExists(to);
    fs.renameSync(from, to);
    console.log('Renamed:', from, '->', to);
  }
}

function updateImportPaths(map) {
  // Build matching map from original relative import path strings to new relative import path strings
  const replacements = new Map();

  for (const [from, to] of map.entries()) {
    const fromRel = './' + path.relative(root, from).split(path.sep).join('/');
    const toRel = './' + path.relative(root, to).split(path.sep).join('/');
    replacements.set(fromRel, toRel);
    const fromNoExt = fromRel.replace(/\.[^/.]+$/, '');
    const toNoExt = toRel.replace(/\.[^/.]+$/, '');
    replacements.set(fromNoExt, toNoExt);
  }

  const allFiles = walk(root).filter(f => /\.(js|jsx|ts|tsx)$/.test(f));
  for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let updated = content;
    for (const [orig, dest] of replacements.entries()) {
      // Build case-insensitive regex for the path after a starting ./ or ../
      const escaped = orig.replace(/^\.\//, '').replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Create pattern that ignores case for letters
      const pattern = escaped.split('').map(ch => {
        if (/[a-zA-Z]/.test(ch)) return '[' + ch.toLowerCase() + ch.toUpperCase() + ']';
        return ch;
      }).join('');
      const regex = new RegExp("(['\"])(\.\/?" + pattern + ")(['\"])","g");
      updated = updated.replace(regex, (m, q1, mid, q3) => {
        // mid may start with ./ or ../ - keep the correct relative prefix from dest
        // dest starts with ./
        const replaced = dest;
        return q1 + replaced + q3;
      });
    }
    if (updated !== content) {
      fs.writeFileSync(file, updated, 'utf8');
      console.log('Updated imports in:', file);
    }
  }
}

function main() {
  if (!fs.existsSync(root)) {
    console.error('src/ not found at', root);
    process.exit(1);
  }
  const files = walk(root);
  const map = buildMapping(files);
  if (map.size === 0) {
    console.log('No case changes needed.');
    return;
  }
  console.log('Planned renames (count):', map.size);
  for (const [from, to] of map.entries()) {
    console.log('  ', path.relative(process.cwd(), from), '->', path.relative(process.cwd(), to));
  }

  applyRenames(map);
  updateImportPaths(map);
  console.log('Done.');
}

main();
