import * as dotenv from "dotenv";
dotenv.config();

// 1. Validate BOT_TOKEN 
if (!process.env.BOT_TOKEN) {
    console.error("❌ FATAL ERROR: BOT_TOKEN is missing in .env file!");
    process.exit(1); 
}

// 2. Validate REDIS_URL (Optional, warn if missing)
if (!process.env.REDIS_URL) {
    console.warn("⚠️ WARNING: REDIS_URL is not set. Defaulting to local Redis.");
}

// 3. Export clean config
export const config = {
    BOT_TOKEN: process.env.BOT_TOKEN!,
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379"
};

console.log("✅ Environment configuration loaded successfully.");