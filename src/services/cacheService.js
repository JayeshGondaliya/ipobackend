import ApiCache from "../models/ApiCache.js";

const inFlight = new Map();

export async function getCachedData(key, ttlMs, requestFunction) {
  const cached = await ApiCache.findOne({ key }).lean();

  // Cached data is still fresh.
  if (cached && Date.now() < new Date(cached.expiresAt).getTime()) {
    return cached.data;
  }

  // Cached data exists but has expired.
  // Return it immediately and refresh in the background.
  if (cached) {
    refreshCache(key, ttlMs, requestFunction).catch((error) => {
      console.error(`Background refresh failed for ${key}:`, error.message);
    });

    return cached.data;
  }

  // No cached data exists: the first request must wait for the API.
  return refreshCache(key, ttlMs, requestFunction);
}

function refreshCache(key, ttlMs, requestFunction) {
  // Prevent duplicate provider calls for the same cache key.
  if (inFlight.has(key)) {
    return inFlight.get(key);
  }

  const refreshPromise = (async () => {
    const response = await requestFunction();

    const now = new Date();

    await ApiCache.findOneAndUpdate(
      { key },
      {
        $set: {
          data: response.data,
          fetchedAt: now,
          expiresAt: new Date(now.getTime() + ttlMs),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return response.data;
  })();

  inFlight.set(key, refreshPromise);

  refreshPromise.finally(() => {
    inFlight.delete(key);
  }).catch(() => {
    // The original promise is handled by its caller.
  });

  return refreshPromise;
}