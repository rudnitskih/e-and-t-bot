import { Scenes } from "telegraf";
import { ActionId } from "../constants.js";
import { NotionManager } from "../NotionManager.js";
import { Markup } from "telegraf";

const notionManager = new NotionManager();

export const confirmScene = new Scenes.BaseScene(ActionId.CONFIRM);
confirmScene.enter(async (ctx) => {
  await ctx.reply("Создаю запись ⏲");

  ctx.session[ActionId.DATE] = new Date();

  try {
    await notionManager.addEvent(ctx.session);
    await ctx.reply("Запись создана ✅");

    await ctx.reply(
      "Запись создана ✅",
      Markup.keyboard(["/start"]).oneTime().resize()
    );
  } catch (e) {
    await ctx.reply(
      (e.response && e.response.data) || e.APIResponseError || e.message
    );
  }
});
