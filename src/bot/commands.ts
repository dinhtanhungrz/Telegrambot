import { Context, SessionFlavor, Composer } from "grammy";

// --- 1. DEFINE TYPES HERE (Instead of types.ts) ---
export interface SessionData {
    step: 'idle' | 'working';
}

export type MyContext = Context & SessionFlavor<SessionData>;

// --- 2. LOGIC COMMANDS ---
export const botCommands = new Composer<MyContext>();

// Command: /start
botCommands.command("start", async (ctx) => {
    ctx.session = { step: 'idle' }; // Reset session
    await ctx.reply(
        "👋 **Welcome to Money Transfer Bot!**\n\n" +
        "System status: **Online**\n" +
        "Session status: **Reset & Idle**\n\n" +
        "👇 *Commands:*\n" +
        "/start - Restart system\n" +
        "/cancel - Cancel operation\n" +
        "/help - Show instructions"
    );
});

// Command: /help
botCommands.command("help", async (ctx) => {
    await ctx.reply(
        "🛠 **Help Menu:**\n\n" +
        "1. **/start** - Reset everything.\n" +
        "2. **/cancel** - Stop current action.\n" +
        "3. **/help** - Show this menu."
    );
});

// Command: /cancel
botCommands.command("cancel", async (ctx) => {
    if (ctx.session.step === 'idle') {
        await ctx.reply("ℹ️ No active operation to cancel.");
        return;
    }
    ctx.session.step = 'idle';
    await ctx.reply("🚫 Operation cancelled. Returned to **Idle** state.");
});