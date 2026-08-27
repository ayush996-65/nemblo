/**
 * Nemblo Telegram Companion Bot
 * Setup:
 *   1. npm install telegraf dotenv
 *   2. Supply BOT_TOKEN, MINI_APP_URL, and SIGNUP_URL via .env file or environment variables.
 *   3. node bot.js
 */

require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const http = require("http");

// Read environment variables (Fallback to production URLs, fail fast if BOT_TOKEN missing in production)
const BOT_TOKEN = process.env.BOT_TOKEN;
const MINI_APP_URL = process.env.MINI_APP_URL || "https://ayush996-65.github.io/nemblo/index.html";
const SIGNUP_URL = process.env.SIGNUP_URL || "https://ayush996-65.github.io/nemblo/signup.html";
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN) {
  console.error("FATAL: BOT_TOKEN is missing from environment variables.");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// --- Dummy Health Check HTTP Server (Required for Render/Railway Web Services) ---
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", service: "Nemblo Telegram Bot" }));
});

server.listen(PORT, () => {
  console.log(`[Health-Check Server] Listening on port ${PORT}`);
});

// --- Main Commands & Interface ---

// /start Command
bot.start(async (ctx) => {
  const welcomeText = 
    `*আসুন, স্বাগতম — Welcome to Nemblo* 👑\n\n` +
    `A companion worthy of your company — across West Bengal.\n\n` +
    `Browse verified buddies for the gym, travel, adda over coffee, or an event, right inside Telegram.`;

  await ctx.replyWithMarkdownV2(
    escapeMarkdown(welcomeText),
    Markup.inlineKeyboard([
      [Markup.button.webApp("🔍 Browse buddies", MINI_APP_URL)],
      [Markup.button.webApp("✍️ Sign up", SIGNUP_URL)],
      [Markup.button.callback("💰 Pricing & Plans", "pricing_info")]
    ])
  );
});

// Pricing Inline Callback Action (Updated to match site plans)
bot.action("pricing_info", async (ctx) => {
  await ctx.answerCbQuery();
  
  const pricingText = 
    `*Nemblo Pricing Plans*\n` +
    `Every plan unlocks the exact same features — unlimited matches, verified profiles, and in-app chat:\n\n` +
    `💳 *EMI Lite:* ₹99/month _(Most Chosen)_\n` +
    `📅 *Monthly:* ₹299/month\n` +
    `🗓 *Annual:* ₹2,499/year\n\n` +
    `*No hidden tiers. Choose the billing rhythm that works for you.*`;

  await ctx.replyWithMarkdownV2(
    escapeMarkdown(pricingText),
    Markup.inlineKeyboard([
      [Markup.button.webApp("Choose a plan", SIGNUP_URL)]
    ])
  );
});

// /browse Command
bot.command("browse", async (ctx) => {
  await ctx.reply(
    "Open the Nemblo Web App to browse verified buddies:",
    Markup.inlineKeyboard([[Markup.button.webApp("🔍 Open Nemblo App", MINI_APP_URL)]])
  );
});

// /signup Command
bot.command("signup", async (ctx) => {
  await ctx.reply(
    "Create your Nemblo profile as a Seeker or Buddy:",
    Markup.inlineKeyboard([[Markup.button.webApp("✍️ Create Profile", SIGNUP_URL)]])
  );
});

// /help Command
bot.command("help", async (ctx) => {
  const helpText = 
    `*Nemblo Command Helper*\n\n` +
    `/start — Main Menu & Introduction\n` +
    `/browse — Open Buddy Browser\n` +
    `/signup — Register as Seeker or Buddy\n` +
    `/help — Display available bot commands`;

  await ctx.replyWithMarkdownV2(escapeMarkdown(helpText));
});

// Escape MarkdownV2 utility helper to avoid Telegram API parse errors
function escapeMarkdown(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, (x) => `\\${x}`);
}

// Global Error Handler
bot.catch((err, ctx) => {
  console.error(`Unhandled bot error on update ${ctx.updateType}:`, err);
});

// Launch Bot
bot.launch().then(() => {
  console.log("🚀 Nemblo Telegram bot is running successfully.");
});

// Graceful Shutdown Handlers
const shutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down safely...`);
  bot.stop(signal);
  server.close(() => {
    process.exit(0);
  });
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
