import { Scenes, session, Telegraf } from "telegraf";
import { ActionId } from "./constants.js";
import { validateEnvVariables } from "./utils.js";
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

const PORT = process.env.PORT || 5000;
const bot = new Telegraf(process.env.BOT_TOKEN);
const appDomain =
  process.env.NODE_ENV === "production"
    ? "fathomless-oasis-27700.herokuapp.com"
    : "fathomless-oasis-27700.loca.lt";

const stage = new Scenes.Stage([
  emotionScene,
  emotionRankScene,
  thoughtScene,
  thoughtRankScene,
  eventScene,
  startOverScene,
  confirmScene,
]);

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

bot.launch({
  dropPendingUpdates: true,
  webhook: {
    domain: `http://${appDomain}`,
    port: PORT,
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
