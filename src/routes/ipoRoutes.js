import express from "express";

import {
  getIpos,
  getGmp,
  getIpoBySlug,
  getGmpBySlug,
} from "../controllers/ipoController.js";
import { getAccountInfo } from "../services/ipoService.js";

const router = express.Router();

router.get("/ipos", getIpos);
router.get("/gmp", getGmp);
router.get("/ipos/:slug", getIpoBySlug);
router.get("/ipos/:slug/gmp", getGmpBySlug);
router.get("/me",getAccountInfo)
export default router;