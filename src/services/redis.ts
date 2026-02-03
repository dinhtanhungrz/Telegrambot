import Redis from "ioredis";
import { ENV } from "../config/env";

export const redisClient = new Redis(ENV.REDIS_URL);

redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
redisClient.on("connect", () => console.log("✅ Redis Connected"));