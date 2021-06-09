import { ActionId, ActionMeta } from "./constants.js";
import { Client } from "@notionhq/client";

export class NotionManager {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  addEvent(data) {
    return this.notion.pages.create({
      parent: { database_id: "1698c5539eeb46ecb452c2607b87e9aa" },
      properties: {
        [ActionMeta[ActionId.DATE].displayName]: {
          type: "date",
          date: { start: toIsoString(data[ActionId.DATE]) },
        },
        [ActionMeta[ActionId.EVENT].displayName]: {
          rich_text: [
            {
              text: { content: data[ActionId.EVENT] },
            },
          ],
        },
        [ActionMeta[ActionId.EMOTION].displayName]: {
          select: {
            name: data[ActionId.EMOTION],
          },
        },
        [ActionMeta[ActionId.EMOTION_RANK].displayName]: {
          number: Number(data[ActionId.EMOTION_RANK]),
        },
        [ActionMeta[ActionId.THOUGHT].displayName]: {
          title: [
            {
              text: {
                content: data[ActionId.THOUGHT],
              },
            },
          ],
        },
        [ActionMeta[ActionId.THOUGHT_RANK].displayName]: {
          number: Number(data[ActionId.THOUGHT_RANK]),
        },
      },
    });
  }
}

// ref: https://stackoverflow.com/questions/17415579/how-to-iso-8601-format-a-date-with-timezone-offset-in-javascript
// for some reason default `toISOString` doesn't respect timezone
// let's hardcode Ukrainian timezone
function toIsoString(date) {
  const tzo = "+03:00";
  const pad = function (num) {
    const norm = Math.floor(Math.abs(num));
    return (norm < 10 ? "0" : "") + norm;
  };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    tzo
  );
}
