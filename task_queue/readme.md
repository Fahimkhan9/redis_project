# 📌 Project 3: Task Queue with Redis Lists

## 🔹 What We’re Learning
This project teaches how to use **Redis Lists** to build a **Task Queue system**.

- **Why Lists?**
  - Lists maintain **order** → perfect for a queue (FIFO).
  - You can **push** tasks and **pop** them in order.
  - Redis provides **blocking pop** (`BLPOP`), meaning workers wait until a task is available.

---

## 🔹 Redis Commands Used

- **`RPUSH queue task`** → Add a task to the right end of the list (enqueue).
- **`LRANGE queue 0 -1`** → View all pending tasks.
- **`BLPOP queue 0`** → Remove & return the first task (waits until task exists).

---

## 🔹 Flow of Task Queue

1. **Producer** (API or any service) pushes tasks to Redis with `RPUSH`.
2. **Consumer (Worker)** waits for new tasks using `BLPOP`.
3. When a task arrives:
   - Worker processes it
   - Removes it from Redis
   - Marks it as done.

---

## 🔹 Example Redis Commands

```bash
# Add tasks to the queue
RPUSH tasks "send_email:123"
RPUSH tasks "generate_report:456"

# See all tasks
LRANGE tasks 0 -1
# ["send_email:123", "generate_report:456"]

# Worker consuming a task (blocking pop)
BLPOP tasks 0
# -> ["tasks", "send_email:123"]

# Remaining tasks
LRANGE tasks 0 -1
# ["generate_report:456"]
