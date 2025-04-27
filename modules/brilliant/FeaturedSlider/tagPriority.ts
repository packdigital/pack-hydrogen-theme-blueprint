const TAG_PRIORITY: Record<string, number> = {
  'Special Edition': 1,
  Bestseller: 2,
  New: 3,
};

export function getPriorityTag(tags: string[] = []): string | undefined {
  const prioritized = tags
    .filter((tag) => Object.prototype.hasOwnProperty.call(TAG_PRIORITY, tag))
    .sort((a, b) => TAG_PRIORITY[a] - TAG_PRIORITY[b]);

  return prioritized[0]; // lowest priority number wins
}
