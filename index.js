const http = require("http");
const { ActionMeta, ActionId, EmotionOptions } = require("./constants");
const { NotionManager } = require("./NotionManager");
const { Telegraf, Markup, Scenes, session } = require("telegraf");

const Scene = Scenes.BaseScene;
const Stage = Scenes.Stage;

const PORT = process.env.PORT || 5000;
const bot = new Telegraf(process.env.BOT_TOKEN);

const notionManager = new NotionManager();

const emotionScene = new Scene(ActionId.EMOTION);
emotionScene.enter(async (ctx) => {
  await ctx.reply("Что чувствуешь?", getEmotionsKeyboard());
});
emotionScene.action(/.*/, (ctx) => {
  updateInfo(ctx, ActionId.EMOTION, ctx.match[0]);
  ctx.scene.enter(ActionId.EMOTION_RANK);
});

const emotionRankScene = new Scene(ActionId.EMOTION_RANK);
emotionRankScene.enter(async (ctx) => {
  await ctx.reply("Сила эмоции:", getRankKeyboard());
});
emotionRankScene.action(/.*/, (ctx) => {
  updateInfo(ctx, ActionId.EMOTION_RANK, ctx.match[0]);
  ctx.scene.enter(ActionId.THOUGHT);
});

const thoughtScene = new Scene(ActionId.THOUGHT);
thoughtScene.enter(async (ctx) => {
  await ctx.reply("Какая мысль была?", getKeyboard(ctx.session));
});
thoughtScene.on("text", (ctx, next) => {
  const command = ctx.message.text;
  updateInfo(ctx, ActionId.THOUGHT, command);
  ctx.scene.enter(ActionId.THOUGHT_RANK);
});

const eventScene = new Scene(ActionId.EVENT);
eventScene.enter(async (ctx) => {
  await ctx.reply("Событие:", getKeyboard(ctx.session));
});
eventScene.on("text", (ctx) => {
  const command = ctx.message.text;
  updateInfo(ctx, ActionId.EVENT, command);
  ctx.scene.enter(ActionId.CONFIRM);
});

const thoughtRankScene = new Scene(ActionId.THOUGHT_RANK);
thoughtRankScene.enter(async (ctx) => {
  await ctx.reply("Вера в мысль:", getRankKeyboard());
});
thoughtRankScene.action(/.*/, (ctx) => {
  updateInfo(ctx, ActionId.THOUGHT_RANK, ctx.match[0]);
  ctx.scene.enter(ActionId.EVENT);
});

const confirmScene = new Scene(ActionId.CONFIRM);
confirmScene.enter(async (ctx) => {
  await ctx.reply("Создаю запись ⏲");

  await notionManager.addEvent(ctx.session);

  await ctx.reply("Запись создана ✅");
  await ctx.scene.enter(ActionId.START_OVER);
});

const startOverScene = new Scene(ActionId.START_OVER);
startOverScene.enter(async (ctx) => {
  Object.keys(ActionId).forEach((key) => {
    delete ctx.session[key];
  });
  await ctx.reply("Новая запись 📁", getKeyboard(ctx.session));
  ctx.scene.enter(ActionId.EMOTION);
});

const stage = new Stage([
  emotionScene,
  emotionRankScene,
  thoughtScene,
  thoughtRankScene,
  eventScene,
  startOverScene,
  confirmScene,
]);

// const secretPath = `/telegraf/${bot.secretPathComponent()}`

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.reply("Начнем", getKeyboard(ctx.session));
  await ctx.scene.enter(ActionId.EMOTION);
});

bot.on("text", async (ctx) => {
  const actionId = getActionIdFromLastMessage(ctx);

  if (actionId) {
    await ctx.scene.enter(actionId);
  }
});

const getKeyboard = (session) => {
  return Markup.keyboard([
    ...[
      [ActionId.EMOTION, ActionId.EMOTION_RANK],
      [ActionId.THOUGHT, ActionId.THOUGHT_RANK],
      [ActionId.EVENT],
      [ActionId.START_OVER, ActionId.CONFIRM],
    ].map((group) =>
      group.map((recordId) => {
        return `${ActionMeta[recordId].icon} ${
          session[recordId] || ActionMeta[recordId].displayName
        }`;
      })
    ),
  ]).resize();
};

const getEmotionsKeyboard = () => {
  return Markup.inlineKeyboard(
    EmotionOptions.map((group) =>
      group.map((text) => ({ text, callback_data: text }))
    )
  );
};

const getRankKeyboard = () => {
  return Markup.inlineKeyboard(
    [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
    ].map((group) => group.map((text) => ({ text, callback_data: text })))
  );
};

const updateInfo = (ctx, key, value) => {
  ctx.session[key] = value;
};

const getActionIdFromLastMessage = (ctx) => {
  const text = ctx.message.text;

  return Object.keys(ActionId).find((key) => {
    const currentValue = ctx.session[key];
    const displayName = ActionMeta[key].displayName;

    return text.includes(currentValue) || text.includes(displayName);
  });
};

bot.catch((error) => {
  console.error("Global error has happened:", error);
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
