export function isSet<T = any>(item: any): item is Set<T> {
  return !!item && item instanceof Set;
}

export function isMap<K = any, V = any>(item: any): item is Map<K, V> {
  return !!item && item instanceof Map;
}
