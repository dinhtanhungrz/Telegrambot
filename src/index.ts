import { Bot, session } from "grammy";
import { RedisAdapter } from "@grammyjs/storage-redis";
import IORedis from "ioredis";
import { config } from "./config/env";
import { botCommands, MyContext, SessionData } from "./bot/commands"; // Import từ commands

// 1. Setup Redis
const redisInstance = new IORedis(config.REDIS_URL);
redisInstance.on('connect', () => console.log("✅ Redis Connected!"));
redisInstance.on('error', (err) => console.error("❌ Redis Error:", err));

// 2. Setup Bot
const bot = new Bot<MyContext>(config.BOT_TOKEN);

// 3. Setup Session
bot.use(session({
    initial: (): SessionData => ({ step: 'idle' }),
    storage: new RedisAdapter({ instance: redisInstance }),
    getSessionKey: (ctx) => ctx.from?.id.toString(),
}));

// 4. Register Commands
bot.use(botCommands);

// 5. Error Handling
bot.catch((err) => {
    console.error("❌ Global Error:", err.error);
});

// 6. Start
console.log("🚀 Bot is starting...");
bot.start();