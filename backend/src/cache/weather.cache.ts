interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Raw OpenWeather responses, keyed by city code.
const rawCache = new Map<string, CacheEntry<any>>();

// Processed dashboard output (ranked list), stored under a single key.
const processedCache = new Map<string, CacheEntry<any>>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Running counters so the debug endpoint can report real HIT / MISS activity.
const stats = {
  rawHits: 0,
  rawMisses: 0,
  processedHits: 0,
  processedMisses: 0,
};

const isExpired = (entry: CacheEntry<any>): boolean =>
  Date.now() - entry.timestamp > CACHE_DURATION;

// ----- Raw weather cache -----

export const getCachedWeather = (cityCode: string): any | null => {
  const entry = rawCache.get(cityCode);

  if (!entry) {
    stats.rawMisses++;
    return null;
  }

  if (isExpired(entry)) {
    rawCache.delete(cityCode);
    stats.rawMisses++;
    return null;
  }

  stats.rawHits++;
  return entry.data;
};

export const setCachedWeather = (cityCode: string, data: any): void => {
  rawCache.set(cityCode, { data, timestamp: Date.now() });
};

// ----- Processed output cache -----

const PROCESSED_KEY = "dashboard";

export const getCachedProcessed = (): any | null => {
  const entry = processedCache.get(PROCESSED_KEY);

  if (!entry) {
    stats.processedMisses++;
    return null;
  }

  if (isExpired(entry)) {
    processedCache.delete(PROCESSED_KEY);
    stats.processedMisses++;
    return null;
  }

  stats.processedHits++;
  return entry.data;
};

export const setCachedProcessed = (data: any): void => {
  processedCache.set(PROCESSED_KEY, { data, timestamp: Date.now() });
};

// ----- Debug / status -----

export const getCacheStatus = () => {
  const now = Date.now();

  const rawEntries = Array.from(rawCache.entries()).map(
    ([cityCode, entry]) => ({
      cityCode,
      status: isExpired(entry) ? "EXPIRED" : "FRESH",
      ageSeconds: Math.round((now - entry.timestamp) / 1000),
    }),
  );

  const processedEntry = processedCache.get(PROCESSED_KEY);

  return {
    cacheDurationSeconds: CACHE_DURATION / 1000,
    raw: {
      hits: stats.rawHits,
      misses: stats.rawMisses,
      cachedCities: rawEntries.length,
      entries: rawEntries,
    },
    processed: {
      hits: stats.processedHits,
      misses: stats.processedMisses,
      cached: !!processedEntry && !isExpired(processedEntry),
      ageSeconds: processedEntry
        ? Math.round((now - processedEntry.timestamp) / 1000)
        : null,
    },
  };
};

export const clearCache = (): void => {
  rawCache.clear();
  processedCache.clear();
  stats.rawHits = 0;
  stats.rawMisses = 0;
  stats.processedHits = 0;
  stats.processedMisses = 0;
};
