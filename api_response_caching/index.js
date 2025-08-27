import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { redisClient } from "./config/redis.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to Redis
redisClient.connect().catch(console.error);

// Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`✅ Server running on ${port}`));
