import { Scenes } from "telegraf";
import { ActionId, ActionMeta } from "../constants.js";
import { getRankKeyboard, updateInfo } from "../utils.js";

export const emotionRankScene = new Scenes.BaseScene(ActionId.EMOTION_RANK);

emotionRankScene.enter(async (ctx) => {
  await ctx.reply(
    `${ActionMeta[ActionId.EMOTION_RANK].icon} Сила эмоции:`,
    getRankKeyboard()
  );
});

emotionRankScene.action(/.*/, (ctx) => {
  updateInfo(ctx, ActionId.EMOTION_RANK, ctx.match[0]);
  ctx.scene.enter(ActionId.THOUGHT);
});
