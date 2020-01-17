function createMap<TSource, TKey>(source: TSource[], keySelector: (item: TSource) => TKey): Map<TKey, TSource>;
function createMap<TSource, TKey, TValue>(
  source: TSource[],
  keySelector: (item: TSource) => TKey,
  valueSelector: (item: TSource) => TValue
): Map<TKey, TValue>;
function createMap<TSource, TKey, TValue>(
  source: TSource[],
  keySelector: (item: TSource) => TKey,
  valueSelector?: (item: TSource) => TValue
) {
  const getValue = valueSelector ?? ((x: TSource) => x as any);

  const result = new Map<TKey, TValue>();
  source.forEach(x => result.set(keySelector(x), getValue(x)));

  return result;
}

export default createMap;
