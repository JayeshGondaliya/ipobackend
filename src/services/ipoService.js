import ipoGuru from "../config/ipoGuru.js";
import { getCachedData } from "./cacheService.js";
import { reserveApiRequest } from "../utils/rateLimiter.js";

const TTL = {
  ACCOUNT: 6 * 60 * 60 * 1000, // 6 hours
  IPO_LIST: 2 * 60 * 60 * 1000, // 2 hours
  IPO_DETAILS: 6 * 60 * 60 * 1000, // 6 hours
  GMP: 15 * 60 * 1000, // 15 minutes
};

async function callIpoGuru(url, config = {}) {
  // Reserve a quota slot before making the provider request.
  await reserveApiRequest();

  const response = await ipoGuru.get(url, config);

  // IPO Guru supplies the real remaining quota in response headers.
  const remaining = response.headers["x-ratelimit-remaining"];

  if (remaining !== undefined) {
    console.log(`IPO Guru requests remaining today: ${remaining}`);
  }

  return response;
}

// GET /me
export async function getAccountInfo() {
  return getCachedData("account:me", TTL.ACCOUNT, () =>
    callIpoGuru("/me")
  );
}

// GET /ipos
export async function getIpos(params = {}) {
  const cacheKey = `ipos:${JSON.stringify(params)}`;

  return getCachedData(cacheKey, TTL.IPO_LIST, () =>
    callIpoGuru("/ipos", { params })
  );
}

// GET /gmp
// One request returns GMP for multiple live IPOs.
export async function getGmp(params = {}) {
  const cacheKey = `gmp:${JSON.stringify(params)}`;

  return getCachedData(cacheKey, TTL.GMP, () =>
    callIpoGuru("/gmp", { params })
  );
}

// GET /ipos/:slug
export async function getIpoBySlug(slug) {
  const cacheKey = `ipo:${slug}`;

  return getCachedData(cacheKey, TTL.IPO_DETAILS, () =>
    callIpoGuru(`/ipos/${encodeURIComponent(slug)}`)
  );
}

// GET /ipos/:slug/gmp
export async function getGmpBySlug(slug) {
  const cacheKey = `ipo-gmp:${slug}`;

  return getCachedData(cacheKey, TTL.GMP, () =>
    callIpoGuru(`/ipos/${encodeURIComponent(slug)}/gmp`)
  );
}