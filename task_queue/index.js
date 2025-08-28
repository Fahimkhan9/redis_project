// project3-task-queue.js
import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

// 🔹 Redis client
const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Error:", err));
await redisClient.connect();

// ----------------------------
// API Routes
// ----------------------------

// ➕ Add a task to the queue
app.post("/enqueue", async (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ message: "Task is required" });

  await redisClient.rPush("taskQueue", task); // RPUSH → enqueue (FIFO)
  res.json({ message: "Task enqueued", task });
});

// 📋 View all tasks in the queue
app.get("/tasks", async (req, res) => {
  const tasks = await redisClient.lRange("taskQueue", 0, -1);
  res.json({ tasks });
});

// ----------------------------
// Worker (Background Consumer)
// ----------------------------
async function startWorker() {
  console.log("⚡ Worker started. Waiting for tasks...");

  while (true) {
    // BLPOP → blocks until a task is available (no busy waiting)
    const result = await redisClient.blPop("taskQueue", 0);
    const task = result?.element;

    if (task) {
      console.log("✅ Processing task:", task);
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("🎉 Task completed:", task);
    }
  }
}
startWorker();

// ----------------------------
// Start Server
// ----------------------------
app.listen(3000, () => {
  console.log("🚀 Task Queue API running on http://localhost:3000");
});
