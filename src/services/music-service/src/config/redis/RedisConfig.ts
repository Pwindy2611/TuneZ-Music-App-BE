import { createClient } from "redis";
import { envConfig } from "../EnvConfig.js";

const redisClient = createClient({
    url: envConfig.getRedisUrl(),
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error("Redis connection failed after 10 retries");
                return new Error("Redis connection failed after 10 retries");
            }
            return Math.min(retries * 100, 3000);
        }
    }
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("connect", () => console.log("✅ Redis Connected"));
redisClient.on("reconnecting", () => console.log("🔄 Redis Reconnecting..."));
redisClient.on("end", () => console.log("❌ Redis Connection Ended"));

(async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
})();

export default redisClient;
