import { createReadStream, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import Koa from 'koa';
import serve from 'koa-static';

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = fileURLToPath(new URL('.', import.meta.url));
const DIST_DIR = resolve(ROOT_DIR, '../dist');
const LAYOUT_FILE = resolve(DIST_DIR, 'index.html');

const app = new Koa();

// Serve everything Vite produced: the bundled app, the media it emitted and
// the contents of `static/` (icons, manifest, sketches, posts) that Vite
// copies to the root of the build output.
app.use(serve(DIST_DIR));

// SPA fallback: any route that does not match a file gets the app shell.
app.use(async (ctx) => {
  if (ctx.method !== 'GET' && ctx.method !== 'HEAD') {
    ctx.status = 405;
    return;
  }

  if (!existsSync(LAYOUT_FILE)) {
    ctx.status = 500;
    ctx.body = 'Build output not found. Run `pnpm build` before `pnpm start`.';
    return;
  }

  ctx.type = 'html';
  ctx.body = createReadStream(LAYOUT_FILE);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
