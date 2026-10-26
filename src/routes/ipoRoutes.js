import express from "express";

import {
  getAccountInfo,
  getIpos,
  getGmp,
  getIpoBySlug,
  getGmpBySlug,
} from "../controllers/ipoController.js";

const router = express.Router();

router.get("/me", getAccountInfo);
router.get("/ipos", getIpos);
router.get("/gmp", getGmp);
router.get("/ipos/:slug", getIpoBySlug);
router.get("/ipos/:slug/gmp", getGmpBySlug);

export default router;