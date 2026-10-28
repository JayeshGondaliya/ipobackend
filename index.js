import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./src/config/database.js";
import ipoRoutes from "./src/routes/ipoRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "https://www.ipogmpp.in",
      "https://ipogmpp.in",
    ],
    methods: ["GET", "POST"],
  })
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "IPO Guru backend is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy",
  });
});

app.use("/api/ipo", ipoRoutes);
app.use("/api/contact", contactRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();