import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
    await redisClient.connect();
    console.log("✅ Redis Connected");
})();

export default redisClient;
