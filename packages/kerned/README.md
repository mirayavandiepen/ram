# kerned

A design-tool selection effect for React. Wrap a word and it gets a hairline outline, four corner handles and a live `width × height` label, with a short letter-spacing pass that never moves the text around it.

```bash
pnpm add kerned
```

```tsx
import { Kerned } from "kerned";

export default function Example() {
  return (
    <h1>
      built to <Kerned>delight</Kerned>
    </h1>
  );
}
```

Zero dependencies. Inherits the parent's typography. Respects `prefers-reduced-motion`.

## Props

| Prop            | Type                                          | Default      |
| --------------- | --------------------------------------------- | ------------ |
| `children`      | `ReactNode`                                   | required     |
| `delay`         | `number` (ms)                                 | `0`          |
| `duration`      | `number` (ms)                                 | `1400`       |
| `holdDuration`  | `number` (ms)                                 | `1200`       |
| `label`         | `boolean \| (size) => string`                 | `true`       |
| `labelPosition` | `"top" \| "bottom" \| "top-left" \| …`        | `"top"`      |
| `handles`       | `boolean`                                     | `true`       |
| `animation`     | `"tracking" \| "static"`                      | `"tracking"` |
| `trigger`       | `"mount" \| "hover" \| "click" \| "manual"`   | `"mount"`    |
| `active`        | `boolean`                                     |              |
| `persistent`    | `boolean`                                     | `false`      |
| `color`         | `string`                                      |              |
| `onStart`       | `() => void`                                  |              |
| `onComplete`    | `() => void`                                  |              |

## CSS variables

```css
--kerned-color             /* outline, handles and label; defaults to currentColor */
--kerned-line-width        /* 1px */
--kerned-outline-opacity   /* 0.6 */
--kerned-handle-size       /* 6px */
--kerned-inset             /* 4px, how far the outline sits outside the text */
--kerned-label-background  /* defaults to the marker colour */
--kerned-label-color       /* white on light, near-black on dark */
--kerned-label-font-size   /* 11px */
--kerned-label-offset      /* 6px */
```

Full documentation and live examples: https://kerned.dev

MIT
