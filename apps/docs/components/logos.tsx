/**
 * The brand marks, drawn once each and sized by whoever places them.
 *
 * Inline rather than loaded from `.svg` files, because every one of these
 * sits inside a link: an `<img>` cannot inherit the colour its link takes on
 * hover or focus, and would need a second asset per theme. As paths they
 * follow `currentColor` like the rest of the site's icons.
 *
 * Filled rather than stroked, unlike every other icon here. These are logos,
 * and each is only itself at the weight its owner draws it.
 */
type MarkProps = { size?: number };

/** GitHub's Octocat mark. */
export function GitHubIcon({ size = 15 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

/**
 * npm's wordmark. Two and a half times as wide as it is tall, so `size` is
 * its height and the width follows, and the viewBox is cropped to the artwork
 * rather than the square it was drawn in: the original leaves the bar floating
 * in whitespace that would shrink the mark to nothing beside the others.
 */
const NPM_RATIO = 44 / 17.2;

export function NpmIcon({ size = 11 }: MarkProps) {
  return (
    <svg
      width={size * NPM_RATIO}
      height={size}
      viewBox="2 15 44 17.2"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="21.6" y="19.9" width="2.4" height="4.84" />
      <path d="M2,15V29.7H14.2v2.5H24V29.7H46V15ZM14.2,27.2H11.8V19.9H9.3v7.3H4.5V17.5h9.7Zm12.3,0H21.6v2.5H16.7V17.5h9.8Zm17.1,0H41.2V19.9H38.7v7.3H36.2V19.9H33.8v7.3H28.9V17.5H43.6Z" />
    </svg>
  );
}

/** X, formerly Twitter. */
export function XIcon({ size = 13 }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.6 0.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867 -5.07 -4.425 5.07H0.316l5.733 -6.57L0 0.75h5.063l3.495 4.633L12.601 0.75Zm-0.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  );
}
