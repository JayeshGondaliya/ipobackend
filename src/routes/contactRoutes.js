import express from "express";

import {
  submitContactMessage,
  getAllContactMessages,
} from "../controllers/contactController.js";

const router = express.Router();

// Submit contact form
router.post("/", submitContactMessage);

// Get all contact messages
router.get("/getContact", getAllContactMessages);

export default router;