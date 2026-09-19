import { DOCS_MARKDOWN } from "@/lib/markdown";

/**
 * The markdown mirror of the page, served as plain text so a browser shows it
 * rather than downloading it.
 *
 * A constant, so it is built once rather than assembled per request.
 */
export const dynamic = "force-static";

export function GET() {
  return new Response(DOCS_MARKDOWN, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
