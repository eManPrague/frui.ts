function groupBy<TKey, TItem>(collection: TItem[], selector: (item: TItem) => TKey): Map<TKey, TItem[]> {
  const result = new Map<TKey, TItem[]>();

  for (const item of collection) {
    const key = selector(item);
    const bucket = result.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      result.set(key, [item]);
    }
  }

  return result;
}

export default groupBy;
