# kerned

Monorepo for [`kerned`](packages/kerned), a design-tool selection effect for React, and its documentation site.

```
packages/kerned   the library, published to npm
apps/docs         kerned.dev, Next.js
```

## Development

```bash
pnpm install
pnpm dev        # library in watch mode + docs at http://localhost:3000
pnpm build      # library, then docs
pnpm typecheck
```

The docs consume the library through its built `dist`, so the library builds first. In `pnpm dev` both run side by side, and `pnpm typecheck` needs a `pnpm build` behind it on a clean checkout.

## Releasing

```bash
cd packages/kerned
pnpm build
npm publish
```
