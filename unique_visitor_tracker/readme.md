🔑 Redis Concepts Learned
-------------------------

### 1\. What is a Set in Redis?

*   An **unordered collection** of **unique strings**.
    
*   Automatically removes duplicates → no need to check manually.
    
*   Very fast operations (`O(1)` complexity).
    

* * *

### 2\. Redis Commands Used

*   `SADD key value` → Add a member to the Set. If it already exists, Redis ignores it.
    
*   `SCARD key` → Count how many **unique** members exist in the Set.
    
*   `SMEMBERS key` → Retrieve all members of the Set.