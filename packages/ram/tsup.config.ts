import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ["react", "react-dom"],
  // Keeps the component usable from server components in Next.js without the
  // consumer having to wrap it themselves.
  banner: { js: '"use client";' },
});
