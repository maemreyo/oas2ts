const cache: Map<string, unknown> = new Map();

// Get item from cache
export const getFromCache = (key: string): unknown | undefined => {
  return cache.get(key);
};

// Set item to cache
export const setToCache = (key: string, value: unknown): void => {
  cache.set(key, value);
};
