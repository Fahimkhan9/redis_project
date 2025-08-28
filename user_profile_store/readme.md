# 🚀 Project 2: User Profile Store (Redis Hashes)

<details>
<summary>📖 Click to expand project description</summary>

This project demonstrates how to store and retrieve **user profiles** efficiently using **Redis Hashes** alongside MongoDB.  
Instead of caching JSON strings, Redis Hashes let us store structured data with fields (like `name`, `email`, `age`) — allowing faster access and updates.

</details>

---

## 🔑 Key Concepts Learned
- **Redis Hashes**: Store structured key-value pairs inside a single Redis key (like a mini object).
- **Cache-Aside Pattern**: First check Redis → fallback to DB → update Redis.
- **Synchronization**: Keeping MongoDB (persistent) and Redis (fast cache) in sync.
- **Performance**: Faster profile reads and updates compared to querying DB every time.

---

## ⚡ Flow
1. **Client** requests a user profile.  
2. **API** checks Redis first using `hGetAll`.  
   - If **found** → return cached result instantly (**cache hit**).  
   - If **not found** → query MongoDB → return result → save to Redis hash (**cache miss**).  
3. Updates (`PUT`) modify **both DB & Redis Hash**.  
4. Deletes (`DELETE`) remove the user from **both DB & Redis**.

---

## 🔧 Redis Commands Used
- `hSet(key, fields)` → save/update structured data (name, email, age).  
- `hGetAll(key)` → retrieve the full profile from Redis.  
- `del(key)` → remove the user profile from Redis.  

---

