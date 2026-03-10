import { existsSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const target = resolve(__dirname, '../node_modules/playwright-core/lib/generated/webSocketMockSource.js');

if (!existsSync(target)) {
    console.log(`[patch-playwright] file not found: ${target}`);
    process.exit(0);
}

let src = readFileSync(target, 'utf8');

const oldSnippet = "this._origin = (_b = (_a = URL.parse(this.url)) == null ? void 0 : _a.origin) != null ? _b : \"\";";
const newSnippet = `try {\n        this._origin = new URL(this.url).origin || \"\";\n      } catch (e) {\n        this._origin = \"\";\n      }`;

if (src.includes(newSnippet)) {
    console.log('[patch-playwright] already patched');
    process.exit(0);
}

if (src.includes(oldSnippet)) {
    src = src.replace(oldSnippet, newSnippet);
    writeFileSync(target, src, 'utf8');
    console.log('[patch-playwright] patched file');
    process.exit(0);
}

// Fallback: try a regex replacement in case formatting differs
const regex = /this\._origin\s*=\s*\(_b\s*=\s*\(_a\s*=\s*URL\.parse\([^\)]*\)\)\s*==\s*null\s*\?\s*void 0\s*:\s*_a\.origin\)\s*!=\s*null\s*\?\s*_b\s*:\s*"";/;
if (regex.test(src)) {
    src = src.replace(regex, newSnippet);
    writeFileSync(target, src, 'utf8');
    console.log('[patch-playwright] patched file (regex)');
    process.exit(0);
}

console.log('[patch-playwright] pattern not found; no changes made');
process.exit(0);