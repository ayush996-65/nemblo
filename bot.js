const { Telegraf, Markup } = require("telegraf");
const http = require("http");

const BOT_TOKEN = process.env.BOT_TOKEN || "8775424050:AAFmdyFmYeIZNO9_u0jtyPE26VbnphqNQeY";
const MINI_APP_URL = process.env.MINI_APP_URL || "https://ayush996-65.github.io/nemblo/index.html";
const SIGNUP_URL = process.env.SIGNUP_URL || "https://ayush996-65.github.io/nemblo/signup.html";

const PORT = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Nemblo bot is running.");
  })
  .listen(PORT, () => console.log(`Health-check server listening on port ${PORT}`));

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    `আসুন, স্বাগতম — Welcome to Nemblo 👑\n\nA companion worthy of your company — across West Bengal.\n\nBrowse verified buddies for the gym, a trip, adda over coffee, or an event, right here in Telegram.`,
    Markup.inlineKeyboard([
      [Markup.button.webApp("🔍 Browse buddies", MINI_APP_URL)],
      [Markup.button.webApp("✍️ Sign up", SIGNUP_URL)],
      [Markup.button.callback("💰 Pricing", "pricing")],
    ])
  );
});

bot.action("pricing", (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `Nemblo plans — every plan is identical, only the billing differs:\n\n👑 EMI Lite — ₹99/month (most chosen)\n📅 Monthly — ₹299/month\n🗓 Annual — ₹2,499/year`,
    Markup.inlineKeyboard([[Markup.button.webApp("Choose a plan", SIGNUP_URL)]])
  );
});

bot.command("browse", (ctx) => {
  ctx.reply("Open the Nemblo app to browse verified buddies:",
    Markup.inlineKeyboard([[Markup.button.webApp("🔍 Browse buddies", MINI_APP_URL)]])
  );
});

bot.command("signup", (ctx) => {
  ctx.reply("Create your Nemblo profile:",
    Markup.inlineKeyboard([[Markup.button.webApp("✍️ Sign up", SIGNUP_URL)]])
  );
});

bot.command("help", (ctx) => {
  ctx.reply("Commands:\n/start — main menu\n/browse — browse buddies\n/signup — create an account\n/help — this message");
});

bot.launch();
console.log("Nemblo bot running...");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
