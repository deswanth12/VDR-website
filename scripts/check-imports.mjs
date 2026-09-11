import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const allDeps = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
  'fs', 'path', 'crypto', 'child_process', 'url', 'http', 'https', 'stream', 'buffer', 'util', 'os'
]);

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
          let resolved = false;
          const basePath = importPath.startsWith('@/') 
            ? path.join('src', importPath.slice(2))
            : path.resolve(path.dirname(full), importPath);
            
          const candidates = [
            basePath,
            basePath + '.ts',
            basePath + '.tsx',
            basePath + '.js',
            basePath + '.mjs',
            path.join(basePath, 'index.ts'),
            path.join(basePath, 'index.tsx'),
            path.join(basePath, 'index.js')
          ];
          for (const c of candidates) {
            if (fs.existsSync(c)) { resolved = true; break; }
          }
          if (!resolved) {
            console.log('MISSING INTERNAL:', importPath, 'in', full);
          }
        } else {
          const pkgName = importPath.startsWith('@')
            ? importPath.split('/').slice(0, 2).join('/')
            : importPath.split('/')[0];
          if (!allDeps.has(pkgName)) {
            console.log('MISSING PACKAGE:', pkgName, 'in', full);
          }
        }
      }
    }
  }
}

scan('src');
console.log('Check finished.');
