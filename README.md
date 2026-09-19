<div align="center">

# ram

**Design-tool selection frames around text, for React.**

[![npm](https://img.shields.io/npm/v/@mirayavandiepen/ram?style=flat-square&color=0d99ff)](https://www.npmjs.com/package/@mirayavandiepen/ram)
[![license](https://img.shields.io/badge/license-MIT-0d99ff?style=flat-square)](LICENSE)

<!-- Drop the demo recording here: drag an .mp4 into a GitHub issue and paste the asset URL. -->

</div>

## Install

```bash
pnpm add @mirayavandiepen/ram
```

## Usage

```tsx
import { Ram } from "@mirayavandiepen/ram";

<h1>
  built to <Ram>delight</Ram>
</h1>;
```

A hairline outline, four corner handles and a live `width × height` label. Zero dependencies, inherits the parent's typography, and nothing on the line moves while it animates.

```tsx
<Ram trigger="hover">hover me</Ram>
<Ram persistent>always framed</Ram>
<Ram active={isSelected}>controlled</Ram>
<Ram color="#f24822" handleFill="solid">styled</Ram>
```

## Docs

Every prop and CSS variable: [`packages/ram`](packages/ram/README.md)

## Development

```bash
pnpm install
pnpm dev        # library in watch mode + docs at localhost:3000
pnpm build      # library, then docs
```

`packages/ram` is the library, `apps/docs` is the docs site. The docs build on the library's `dist`, so it builds first. Publish with `pnpm build && npm publish` in `packages/ram`.

---

<div align="center">

MIT © [Miraya van Diepen](https://github.com/mirayavandiepen) · _ram_ is Swedish for "frame"

</div>
