import express from "express";
import { getWeather } from "../controllers/WeatherController";

const router = express.Router();
router.get("/:city", getWeather);

export default router;
