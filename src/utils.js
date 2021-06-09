import { Markup } from "telegraf";
import { ActionId, ActionMeta, EmotionOptions } from "./constants.js";

export const getKeyboard = (session) => {
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

export const getEmotionsKeyboard = () => {
  return Markup.inlineKeyboard(
    EmotionOptions.map((group) =>
      group.map((text) => ({ text, callback_data: text }))
    )
  );
};

export const getRankKeyboard = () => {
  return Markup.inlineKeyboard(
    [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
    ].map((group) => group.map((text) => ({ text, callback_data: text })))
  );
};

export const updateInfo = (ctx, key, value) => {
  ctx.session[key] = value;
};

export const getActionIdFromLastMessage = (ctx) => {
  const text = ctx.message.text;

  return Object.keys(ActionId).find((key) => {
    const currentValue = ctx.session[key];
    const displayName = ActionMeta[key].displayName;

    return text.includes(currentValue) || text.includes(displayName);
  });
};

export const validateEnvVariables = () => {
  ["BOT_TOKEN", "NOTION_TOKEN"].forEach((secret) => {
    if (!process.env[secret]) {
      throw `Env variable ${secret} is not passed`;
    }
  });
};
