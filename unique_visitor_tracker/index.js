import express from "express";
import { createClient } from "redis";

const app = express();
const PORT = 5000;

// Create Redis client
const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Error:", err));
await redisClient.connect();

// Middleware to simulate user visits
app.get("/visit/:userId", async (req, res) => {
  const { userId } = req.params;

  // Add userId into Redis Set
  await redisClient.sAdd("unique_visitors", userId);

  // Count unique visitors
  const totalVisitors = await redisClient.sCard("unique_visitors");

  res.json({
    message: `User ${userId} visited.`,
    uniqueVisitors: totalVisitors,
  });
});

// Get all unique visitor IDs
app.get("/visitors", async (req, res) => {
  const visitors = await redisClient.sMembers("unique_visitors");
  res.json({ visitors });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
