import * as ipoService from "../services/ipoService.js";

function pickQueryParams(query, allowedKeys) {
  const params = {};

  for (const key of allowedKeys) {
    if (query[key] !== undefined) {
      params[key] = query[key];
    }
  }

  return params;
}

// GET /api/ipo/me
export async function getAccountInfo(req, res, next) {
  try {
    const data = await ipoService.getAccountInfo();
    res.json(data);
  } catch (error) {
    next(error);
  }
}

// GET /api/ipo/ipos
export async function getIpos(req, res, next) {
  try {
    const params = pickQueryParams(req.query, [
      "type",
      "status",
      "search",
      "months",
      "limit",
    ]);

    const data = await ipoService.getIpos(params);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

// GET /api/ipo/gmp
export async function getGmp(req, res, next) {
  try {
    const params = pickQueryParams(req.query, [
      "type",
      "status",
    ]);

    const data = await ipoService.getGmp(params);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

// GET /api/ipo/ipos/:slug
export async function getIpoBySlug(req, res, next) {
  try {
    const data = await ipoService.getIpoBySlug(req.params.slug);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

// GET /api/ipo/ipos/:slug/gmp
export async function getGmpBySlug(req, res, next) {
  try {
    const data = await ipoService.getGmpBySlug(req.params.slug);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

