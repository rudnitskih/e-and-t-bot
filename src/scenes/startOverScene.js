import { Scenes } from "telegraf";
import { ActionId } from "../constants.js";
import { getKeyboard } from "../utils.js";

export const startOverScene = new Scenes.BaseScene(ActionId.START_OVER);
startOverScene.enter(async (ctx) => {
  Object.keys(ActionId).forEach((key) => {
    delete ctx.session[key];
  });
  await ctx.reply("⏬ Новая запись...", getKeyboard(ctx.session));
  ctx.scene.enter(ActionId.EMOTION);
});
