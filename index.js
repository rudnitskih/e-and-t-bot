const http = require('http');
const {Telegraf, Markup} = require('telegraf');

const PORT = process.env.PORT || 5000;
const bot = new Telegraf(process.env.BOT_TOKEN);
const EventDetails = {
  EMOTION: '🎭 Эмоция',
  EMOTION_RANK: '🔢 Сила эмоции'
}
// const secretPath = `/telegraf/${bot.secretPathComponent()}`

const eventKeyboard = Markup.keyboard([[EventDetails.EMOTION, EventDetails.EMOTION_RANK]]);

bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('text', async (ctx) => {
  console.log('Ctx=', ctx);
  // Using context shortcut
  await ctx.reply('Event added to notion', eventKeyboard);
});

bot.launch();


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

http.createServer(() => {
  // bot.webhookCallback(secretPath);

}).listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
