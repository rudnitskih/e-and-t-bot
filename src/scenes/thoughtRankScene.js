import { Scenes } from "telegraf";
import { ActionId, ActionMeta } from "../constants.js";
import { getRankKeyboard, updateInfo } from "../utils.js";

export const thoughtRankScene = new Scenes.BaseScene(ActionId.THOUGHT_RANK);
thoughtRankScene.enter(async (ctx) => {
  await ctx.reply(
    `${ActionMeta[ActionId.THOUGHT_RANK].icon} Вера в мысль:`,
    getRankKeyboard()
  );
});
thoughtRankScene.action(/.*/, (ctx) => {
  updateInfo(ctx, ActionId.THOUGHT_RANK, ctx.match[0]);
  ctx.scene.enter(ActionId.EVENT);
});
