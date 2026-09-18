# ram

Monorepo for [`ram`](packages/ram), a tiny React component for animated design-tool selection frames around text, and its documentation site.

The name is Swedish for "frame".

```
packages/ram   the library, published to npm
apps/docs      ram.dev, Next.js
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
cd packages/ram
pnpm build
npm publish
```
