import localtunnel from "localtunnel";
import { Scenes, session, Telegraf } from "telegraf";
import { ActionId } from "./constants.js";
import { getActionIdFromLastMessage, validateEnvVariables } from "./utils.js";
import {
  confirmScene,
  emotionRankScene,
  emotionScene,
  eventScene,
  startOverScene,
  thoughtRankScene,
  thoughtScene,
} from "./scenes/index.js";

validateEnvVariables();

const stage = new Scenes.Stage([
  emotionScene,
  emotionRankScene,
  thoughtScene,
  thoughtRankScene,
  eventScene,
  startOverScene,
  confirmScene,
]);

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.scene.enter(ActionId.START_OVER);
});

bot.on("text", async (ctx) => {
  const actionId = getActionIdFromLastMessage(ctx);

  if (actionId) {
    await ctx.scene.enter(actionId);
  }
});

bot.catch((error) => {
  console.error("Global error has happened:", error);
});

(async () => {
  let appUrl = "http://fathomless-oasis-27700.herokuapp.com";
  const PORT = process.env.PORT || 5000;

  if (process.env.NODE_ENV !== "production") {
    const tunnel = await localtunnel({ port: PORT });

    appUrl = tunnel.url;

    tunnel.on("close", () => {
      bot.stop("LOCAL_TUNNEL_CLOSED");
    });
  }

  bot.launch({
    dropPendingUpdates: true,
    webhook: {
      domain: appUrl,
      port: PORT,
    },
  });
})();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
