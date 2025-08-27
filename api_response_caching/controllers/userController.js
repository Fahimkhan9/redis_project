import User from "../models/User.js";
import { getOrSetCache } from "../utils/cache.js";
import { redisClient } from "../config/redis.js";

export const getUser = async (req, res) => {
  const id = req.params.id;
  const key = `cache:user:${id}`;

  try {
    const user = await getOrSetCache(key, 600, async () => {
      const doc = await User.findById(id).lean();
      return doc ?? { message: "Not found" };
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true, upsert: false }).lean();

    // Invalidate cache
    try {
      await redisClient.del(`cache:user:${id}`);
    } catch (err) {
      console.error("Redis DEL failed:", err);
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};
