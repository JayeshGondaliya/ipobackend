const cache = new Map();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedData(key, requestFunction) {
  const cached = cache.get(key);

  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const response = await requestFunction();

  cache.set(key, {
    data: response.data,
    expiresAt: Date.now() + CACHE_DURATION,
  });

  return response.data;
}