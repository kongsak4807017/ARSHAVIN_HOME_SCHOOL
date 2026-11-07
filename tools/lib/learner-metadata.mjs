// A learner field begins with a field label and supplies a blank to fill.
// Mentions of names, dates or passwords inside instructions are never metadata.
export function isLearnerMetadata(text) {
  const value = String(text || '').trim().replace(/^(?:HB|AI|ENV|MAKER|CIT)-\d+\s*[·:–-]\s*/i, '');
  return /^(?:ชื่อ|รหัส(?:ผลงาน|งาน|ผู้เรียน)|name\b|nickname\b|date\b|วันที่)/i.test(value) && /_{3,}/.test(value);
}
