import "dotenv/config";
import axios from "axios";

const BASE_URL = process.env.IPO_GURU_BASE_URL;
const API_KEY = process.env.IPO_GURU_API_KEY;

if (!BASE_URL || !API_KEY) {
  throw new Error(
    "IPO_GURU_BASE_URL or IPO_GURU_API_KEY is missing in .env"
  );
}

const ipoGuru = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "X-API-KEY": API_KEY,
    Accept: "application/json",
  },
});

export default ipoGuru;