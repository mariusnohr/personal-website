# personal-website

Personal website and archive of generative and interactive sketches by
[Marius Nohr](https://nohr.xyz).

## Stack

- **Client**: TypeScript, bundled with [Vite](https://vite.dev/)
- **Server**: [Koa](https://koajs.com/) serving the built client and the
  static assets
- **Package manager**: [pnpm](https://pnpm.io/)
- **Quality**: `tsc` for typechecking, ESLint + Prettier for linting and
  formatting, Vitest for tests

Everything that used to live under `static/` (icons, web manifest, sketches and
posts) is treated as Vite's `publicDir`, so it is served during development and
copied verbatim to the root of the build output.

## Requirements

- Node.js >= 20.19
- pnpm

## Scripts

```sh
pnpm install        # install dependencies

pnpm dev            # start the Vite dev server

pnpm build          # build the client to ./dist
pnpm start          # serve ./dist (Koa) on http://localhost:3000

pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint
pnpm format         # prettier --write
pnpm test           # vitest run
```

## Deployment

Build the client and run the server, e.g. with pm2:

```sh
pnpm install
pnpm build
pm2 start "pnpm start" --name personal-website
```

The server listens on `PORT` (default `3000`) and serves the SPA shell for any
route that does not match a file in `dist/`.

### Standalone artifact

`pnpm build` also wraps the Vite output in a Next.js style standalone bundle at
`.next/standalone/`, which is what the hosting platform stages and runs:

```
.next/standalone/
  server.js     # self-contained static server for dist/ (no dependencies)
  package.json
  dist/         # Vite build output
```

The bundle is self-contained because only that directory is uploaded to the
server, so it does not rely on the project's `node_modules`. The generated
`server.js` honours `PORT`/`HOSTNAME`, serves directory indexes (the
experiments) and falls back to `dist/index.html` for SPA routes.
