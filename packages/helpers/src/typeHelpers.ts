export function isSet<T = any>(item: any): item is Set<T> {
  return item && typeof item.add === "function" && typeof item.has === "function" && typeof item.delete === "function";
}

export function isMap<K = any, V = any>(item: any): item is Map<K, V> {
  return item && typeof item.add === "function" && typeof item.has === "function" && typeof item.delete === "function";
}
