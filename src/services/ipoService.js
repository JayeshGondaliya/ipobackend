import ipoGuru from "../config/ipoGuru.js";
import { getCachedData } from "../utils/cache.js";

// Check API key, plan and quota
export async function getAccountInfo() {
  const response = await ipoGuru.get("/me");
  return response.data;
}

// Get IPO list
export async function getIpos(params = {}) {
  const cacheKey = `ipos:${JSON.stringify(params)}`;

  return getCachedData(cacheKey, () =>
    ipoGuru.get("/ipos", { params })
  );
}

// Get GMP for multiple IPOs
export async function getGmp(params = {}) {
  const cacheKey = `gmp:${JSON.stringify(params)}`;

  return getCachedData(cacheKey, () =>
    ipoGuru.get("/gmp", { params })
  );
}

// Get details of one IPO
export async function getIpoBySlug(slug) {
  const cacheKey = `ipo:${slug}`;

  return getCachedData(cacheKey, () =>
    ipoGuru.get(`/ipos/${encodeURIComponent(slug)}`)
  );
}

// Get GMP of one IPO
export async function getGmpBySlug(slug) {
  const cacheKey = `ipo-gmp:${slug}`;

  return getCachedData(cacheKey, () =>
    ipoGuru.get(`/ipos/${encodeURIComponent(slug)}/gmp`)
  );
}