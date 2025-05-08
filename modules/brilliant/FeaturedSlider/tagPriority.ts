const TAG_META: Record<string, {priority: number; color: string}> = {
  'Special Edition': {priority: 1, color: 'bg-yellow-400 text-black'},
  Bestseller: {priority: 2, color: 'bg-red-500 text-white text-shadow'},
  New: {priority: 3, color: 'bg-green-500 text-white text-shadow'},
  Featured: {priority: 4, color: 'bg-orange-500 text-white text-shadow'},
};

export function getPriorityTag(
  tags: string[] = [],
): {tag: string; color: string; priority: number} | undefined {
  const prioritized = tags
    .filter((tag) => Object.hasOwn(TAG_META, tag))
    .sort((a, b) => TAG_META[a].priority - TAG_META[b].priority);

  const topTag = prioritized[0];
  if (!topTag) return undefined;

  return {
    tag: topTag,
    color: TAG_META[topTag].color,
    priority: TAG_META[topTag].priority,
  };
}
