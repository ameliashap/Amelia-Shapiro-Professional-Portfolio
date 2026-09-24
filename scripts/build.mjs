import { readFile, readdir, mkdir, rm, writeFile, cp } from 'node:fs/promises';
const assets = {};
for (const file of await readdir('public')) {
  assets['/' + file] = { data: (await readFile('public/' + file)).toString('base64'), type: file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'image/jpeg' };
}
await rm('dist', { recursive:true, force:true });
await mkdir('dist/server', { recursive:true });
await mkdir('dist/.openai', { recursive:true });
await writeFile('dist/server/index.js', 'const ASSETS = ' + JSON.stringify(assets) + ';\n' + await readFile('worker/index.js', 'utf8'));
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');
await cp('drizzle', 'dist/.openai/drizzle', { recursive:true });
console.log('Built portfolio, contact endpoint, and inbox.');
