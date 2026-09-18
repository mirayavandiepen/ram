import type { ReactNode } from "react";

type Token = { kind: string; text: string };

const KEYWORDS =
  /^\b(import|from|export|default|function|return|const|let|true|false|null|as)\b/;

const RULES: [RegExp, string][] = [
  [/^\/\/.*/, "comment"],
  [/^\/\*[\s\S]*?\*\//, "comment"],
  [/^"[^"]*"|^'[^']*'|^`[^`]*`/, "string"],
  [/^<\/?[A-Za-z][\w.]*/, "tag"],
  [/^\/?>/, "tag"],
  [KEYWORDS, "keyword"],
  [/^--[\w-]+/, "attr"],
  [/^[A-Za-z_$][\w$]*(?=\s*[=:](?!=))/, "attr"],
  [/^\d+(\.\d+)?(px|ms|em|%)?/, "string"],
  [/^[{}()[\];,=.]/, "punct"],
  [/^\s+/, "text"],
  [/^[^\s]/, "text"],
];

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let rest = source;
  while (rest.length > 0) {
    let matched = false;
    for (const [pattern, kind] of RULES) {
      const match = pattern.exec(rest);
      if (match && match[0].length > 0) {
        const text = match[0];
        const last = tokens[tokens.length - 1];
        if (last && last.kind === kind && (kind === "text" || kind === "punct")) {
          last.text += text;
        } else {
          tokens.push({ kind, text });
        }
        rest = rest.slice(text.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push({ kind: "text", text: rest[0] ?? "" });
      rest = rest.slice(1);
    }
  }
  return tokens;
}

export function highlight(source: string): ReactNode[] {
  return tokenize(source).map((token, i) =>
    token.kind === "text" ? (
      token.text
    ) : (
      <span key={i} className={`tok-${token.kind}`}>
        {token.text}
      </span>
    ),
  );
}
