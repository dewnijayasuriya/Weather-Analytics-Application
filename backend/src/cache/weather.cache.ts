interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedWeather = (
  cityCode: string
): any | null => {
  const entry = cache.get(cityCode);

  if (!entry) {
    return null;
  }

  const isExpired =
    Date.now() - entry.timestamp > CACHE_DURATION;

  if (isExpired) {
    cache.delete(cityCode);
    return null;
  }

  return entry.data;
};


export const setCachedWeather = (
  cityCode: string,
  data: any
): void => {
  cache.set(cityCode, {
    data,
    timestamp: Date.now(),
  });
};


export const getCacheStatus = () => {
  const entries: Record<string, string> = {};

  cache.forEach((entry, cityCode) => {
    const isExpired =
      Date.now() - entry.timestamp > CACHE_DURATION;

    entries[cityCode] = isExpired ? "EXPIRED" : "HIT";
  });

  return entries;
};


export const clearCache = (): void => {
  cache.clear();
};