import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    BOT_TOKEN: z.string().min(1, "Thiếu BOT_TOKEN"),
    ADMIN_GROUP_ID: z.string().min(1, "Thiếu ADMIN_GROUP_ID"), // String vì ID group có thể dài
    REDIS_URL: z.string().default("redis://localhost:6379"),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const ENV = envSchema.parse(process.env);