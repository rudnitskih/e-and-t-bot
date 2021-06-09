import { Scenes } from "telegraf";
import { ActionId, ActionMeta } from "../constants.js";
import { getEmotionsKeyboard, updateInfo } from "../utils.js";

export const emotionScene = new Scenes.BaseScene(ActionId.EMOTION);

emotionScene.enter(async (ctx) => {
  await ctx.reply(
    `${ActionMeta[ActionId.EMOTION].icon} Что чувствуешь?`,
    getEmotionsKeyboard()
  );
});

emotionScene.action(/.*/, (ctx) => {
  updateInfo(ctx, ActionId.EMOTION, ctx.match[0]);
  ctx.scene.enter(ActionId.EMOTION_RANK);
});
