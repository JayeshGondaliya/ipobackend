import "dotenv/config";
import express from "express";
import cors from "cors";

import ipoRoutes from "./src/routes/ipoRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);

// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IPO Guru backend is running",
  });
});

// IPO routes
app.use("/api/ipo", ipoRoutes);

// Error handler must come after routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});