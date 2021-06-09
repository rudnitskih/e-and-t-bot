import { Scenes } from "telegraf";
import { ActionId, ActionMeta } from "../constants.js";
import { getKeyboard, updateInfo } from "../utils.js";

export const thoughtScene = new Scenes.BaseScene(ActionId.THOUGHT);
thoughtScene.enter(async (ctx) => {
  await ctx.reply(
    `${ActionMeta[ActionId.THOUGHT].icon} Какая мысль была?`,
    getKeyboard(ctx.session)
  );
});
thoughtScene.on("text", (ctx) => {
  const command = ctx.message.text;
  updateInfo(ctx, ActionId.THOUGHT, `«${command}»`);
  ctx.scene.enter(ActionId.THOUGHT_RANK);
});
