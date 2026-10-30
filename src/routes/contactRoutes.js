import express from "express";
import { submitContactMessage,getAllContactMessages } from "../controllers/contactController.js";

const router = express.Router();

router.post("/", submitContactMessage);
router.get("/", getAllContactMessages);
export default router;
