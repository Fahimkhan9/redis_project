// index.js
import express from "express";
import mongoose from "mongoose";
import { createClient } from "redis";

const app = express();
app.use(express.json());

// --- MongoDB Setup ---
mongoose.connect("mongodb://127.0.0.1:27017/redis_project");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});
const User = mongoose.model("User", userSchema);

// --- Redis Setup ---
const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Error:", err));
await redisClient.connect();

// --- Routes ---

// Create User
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);

    // Store in Redis Hash
    const redisKey = `user:${user._id}`;
    await redisClient.hSet(redisKey, {
      name: user.name,
      email: user.email,
      age: user.age.toString(),
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const redisKey = `user:${id}`;

  // Check Redis Hash first
  const cachedUser = await redisClient.hGetAll(redisKey);

  if (Object.keys(cachedUser).length) {
    return res.json({ source: "cache", user: cachedUser });
  }

  // If not in Redis → fetch from DB
  const user = await User.findById(id).lean();
  if (!user) return res.status(404).json({ error: "User not found" });

  // Save in Redis for next time
  await redisClient.hSet(redisKey, {
    name: user.name,
    email: user.email,
    age: user.age.toString(),
  });

  res.json({ source: "db", user });
});

// Update User
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const updated = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!updated) return res.status(404).json({ error: "User not found" });

  // Update Redis Hash
  const redisKey = `user:${id}`;
  await redisClient.hSet(redisKey, {
    name: updated.name,
    email: updated.email,
    age: updated.age.toString(),
  });

  res.json({ message: "User updated", user: updated });
});

// Delete User
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);

  // Remove from Redis
  const redisKey = `user:${id}`;
  await redisClient.del(redisKey);

  res.json({ message: "User deleted" });
});

// --- Start Server ---
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
