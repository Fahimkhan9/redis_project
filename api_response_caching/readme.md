
# 🚀 Project 1: API Response Caching with Redis – Flow & Commands

## 🔹 Flow of API Request with Redis Cache

1. **Client requests data** → API checks Redis first.
2. **Cache Hit:** If found → return cached result instantly.
3. **Cache Miss:** If not found → query DB → return result → save it to Redis for next requests.

---

## 🔹 Redis Commands Used

- `redis.createClient()` → create a Redis client instance and connect to Redis.
- `get(key)` → retrieve cached data from Redis.
- `setEx(key, ttl, value)` → save data in Redis with a Time-To-Live (expiration).
- **Middleware/Helper Pattern:**  
  - Check cache first  
  - If miss → query DB  
  - Store the result in Redis for future requests

# 🔹 Redis Cache Flow Diagram

```text
            ┌───────────────┐
            │   Client      │
            └───────┬───────┘
                    │ Request / GET
                    ▼
            ┌───────────────┐
            │  Express API  │
            └───────┬───────┘
                    │
           Check Redis Cache (GET key)
                    │
        ┌───────────┴───────────┐
        │                       │
   Cache Hit?                 Cache Miss
        │                       │
        ▼                       ▼
 ┌───────────────┐       ┌───────────────┐
 │  Return Data  │       │ Fetch from DB /│
 │   from Redis  │       │  External API │
 └───────┬───────┘       └───────┬───────┘
         │                       │
         ▼                       ▼
     ✅ Client gets           Store Result in Redis
        Response                  (SETEX key TTL)
                                 │
                                 ▼
                         ✅ Client gets Response
