<div align="center">

# ram

**A tiny React component for animated design-tool selection frames around text.**

Wrap a word and it gets a hairline outline, four corner handles and a live `width × height` label — the way a design tool selects a layer.

[![npm](https://img.shields.io/badge/npm-ram-0d99ff?style=flat-square)](https://www.npmjs.com/package/ram)
[![docs](https://img.shields.io/badge/docs-ram.dev-0d99ff?style=flat-square)](https://ram.dev)
[![license](https://img.shields.io/badge/license-MIT-0d99ff?style=flat-square)](LICENSE)

<!-- Drop the demo recording here: drag an .mp4 into a GitHub issue and paste the asset URL. -->

</div>

---

## Install

```bash
pnpm add ram
```

## Usage

Wrap the text you want framed. That's the whole API surface for the common case.

```tsx
import { Ram } from "ram";

export default function Example() {
  return (
    <h1>
      built to <Ram>delight</Ram>
    </h1>
  );
}
```

The frame fades in, runs a short letter-spacing pass, holds its measurement, and leaves. Nothing else on the line moves while it does — the tracking is given back as margin, so the line width stays exactly where it was.

## Why it feels right

- 🪶 **Zero dependencies.** One component, no runtime baggage.
- ✍️ **Inherits your typography.** Font, size and weight come from the parent, so it looks native to the text it frames.
- 📐 **Measures for real.** The label reports the rendered box, and follows it on resize.
- ♿ **Respects `prefers-reduced-motion`.** The tracking pass drops out; the frame still reads.
- 🎛️ **Yours to style.** Every colour, size and offset is a CSS variable.

## Controlling it

Change what starts the frame, keep it on the page, or drive it from your own state:

```tsx
<Ram trigger="hover">hover me</Ram>
<Ram persistent>always framed</Ram>
<Ram active={isSelected}>controlled</Ram>
```

And make it yours:

```tsx
<Ram color="#f24822" handleFill="solid" labelPosition="bottom-right">
  styled
</Ram>
```

Full prop list and CSS variables: [`packages/ram/README.md`](packages/ram/README.md).

## Documentation

| Guide                                               | What's in it                           |
| --------------------------------------------------- | -------------------------------------- |
| [API](https://ram.dev/docs/api)                     | Every prop, type and callback          |
| [Animation](https://ram.dev/docs/animation)         | Timing, triggers and the tracking pass |
| [Appearance](https://ram.dev/docs/appearance)       | Labels, handles and outlines           |
| [Styling](https://ram.dev/docs/styling)             | CSS variables and theming              |
| [Accessibility](https://ram.dev/docs/accessibility) | Reduced motion and semantics           |

## Repository

```
packages/ram   the library, published to npm
apps/docs      ram.dev, Next.js
```

```bash
pnpm install
pnpm dev        # library in watch mode + docs at localhost:3000
pnpm build      # library, then docs
pnpm typecheck
```

The docs consume the library through its built `dist`, so the library builds first. In `pnpm dev` both run side by side, and on a clean checkout `pnpm typecheck` needs a `pnpm build` behind it.

**Releasing**

```bash
cd packages/ram
pnpm build
npm publish
```

## About the name

**Ram** is Swedish for "frame" — pronounced `/rɑːm/`, like _rahm_, rhyming with "calm".

---

<div align="center">

MIT © [Miraya van Diepen](https://github.com/mirayavandiepen)

</div>
