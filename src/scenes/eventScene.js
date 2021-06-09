import { Scenes } from "telegraf";
import { ActionId, ActionMeta } from "../constants.js";
import { getKeyboard, updateInfo } from "../utils.js";

export const eventScene = new Scenes.BaseScene(ActionId.EVENT);
eventScene.enter(async (ctx) => {
  await ctx.reply(
    `${ActionMeta[ActionId.EVENT].icon} Событие:`,
    getKeyboard(ctx.session)
  );
});
eventScene.on("text", (ctx) => {
  const command = ctx.message.text;
  updateInfo(ctx, ActionId.EVENT, command);
  ctx.scene.enter(ActionId.CONFIRM);
});
