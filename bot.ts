import { Bot } from "grammy";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is missing");

// Create an instance of the `Bot` class
const bot = new Bot(token); 

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! now u can chat with me."));

// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));


// Start the bot.
bot.start({
  onStart: (botInfo) => {
    console.log(`Bot @${botInfo.username} đã khởi động thành công!`);
  },
});



//npx ts-node bot.ts