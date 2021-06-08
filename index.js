const http = require("http");
const { RecordId } = require("./constants");
const { NotionManager } = require("./NotionManager");
const { Telegraf, Markup } = require("telegraf");

const PORT = process.env.PORT || 5000;
const bot = new Telegraf(process.env.BOT_TOKEN);

const notionManager = new NotionManager();
// const secretPath = `/telegraf/${bot.secretPathComponent()}`

bot.start((ctx) => ctx.reply("Welcome"));
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on("text", async (ctx) => {
  const thought = ctx.update.message.text;
  // Using context shortcut
  // ctx.telegram.sendMessage("Создаю запись ⏲");
  await ctx.reply("Создаю запись ⏲");

  await notionManager.addEvent({
    [RecordId.THOUGHT]: thought,
  });

  const eventKeyboard = Markup.keyboard([
    [RecordId.DATE, RecordId.EVENT],
    [RecordId.EMOTION, RecordId.EMOTION_RANK],
    [RecordId.THOUGHT, RecordId.THOUGHT_RANK],
  ]);

  eventKeyboard.resize();

  await ctx.reply("Запись создана ✅", eventKeyboard);
});

bot.catch((error) => {
  console.error(undefined, "Global error has happened, %O", error);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

http
  .createServer(() => {
    // bot.webhookCallback(secretPath);
  })
  .listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
