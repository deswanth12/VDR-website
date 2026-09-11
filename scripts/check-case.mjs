import fs from 'fs';
import path from 'path';

let hasMismatch = false;

function checkCase(filePath) {
  const parts = filePath.split(/[\\\/]/);
  let current = '.';
  for (const part of parts) {
    if (part === '.' || part === '') continue;
    const entries = fs.readdirSync(current);
    if (!entries.includes(part)) {
      const match = entries.find(e => e.toLowerCase() === part.toLowerCase());
      if (match) {
        console.log(`CASE MISMATCH: asked for '${part}' but disk has '${match}' in '${current}'`);
        hasMismatch = true;
      }
    }
    current = path.join(current, part);
  }
}

function scan(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== 'node_modules' && item !== '.next') scan(full);
    } else if (/\.(ts|tsx|js|mjs)$/.test(item)) {
      const content = fs.readFileSync(full, 'utf8');
      const importRegex = /(?:from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1] || match[2];
        if (importPath.startsWith('.') || importPath.startsWith('@/')) {
          const basePath = importPath.startsWith('@/') 
            ? path.join('src', importPath.slice(2))
            : path.join(path.dirname(full), importPath);
            
          const candidates = [
            basePath + '.ts',
            basePath + '.tsx',
            basePath + '.js',
            path.join(basePath, 'index.ts'),
            path.join(basePath, 'index.tsx'),
            path.join(basePath, 'index.js')
          ];
          for (const c of candidates) {
            if (fs.existsSync(c)) {
              checkCase(c);
              break;
            }
          }
        }
      }
    }
  }
}

scan('src');
if (!hasMismatch) console.log('All internal import cases match disk perfectly!');
