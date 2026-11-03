const LONG_UNDERSCORE_RUN = /_{8,}/g;
const TAG_SPLIT = /(<[^>]+>)/g;

/**
 * Convert long underscore placeholders in text nodes into CSS-drawn answer
 * lines. Tags/attributes are left byte-for-byte unchanged, and short blanks
 * used in arithmetic or letter exercises remain text.
 */
export function replaceLongUnderscores(html) {
  return String(html)
    .split(TAG_SPLIT)
    .map((segment, index) => {
      if (index % 2 === 1) return segment;
      return segment.replace(
        LONG_UNDERSCORE_RUN,
        '<span class="inline-write-line" aria-label="พื้นที่เขียนคำตอบ / Answer line"></span>'
      );
    })
    .join('');
}
