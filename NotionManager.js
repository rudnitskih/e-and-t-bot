const axios = require("axios");
const { ActionMeta } = require("./constants");
const { ActionId } = require("./constants");

class NotionManager {
  constructor() {
    this.httpTransport = axios.create({
      baseURL: "https://api.notion.com/v1/pages",
      headers: {
        "Notion-Version": "2021-05-13",
        Authorization: process.env.NOTION_TOKEN,
      },
    });
  }

  addEvent(rawData) {
    return this.httpTransport.post("/", {
      parent: { database_id: "1698c5539eeb46ecb452c2607b87e9aa" },
      properties: {
        [ActionMeta[ActionId.DATE].displayName]: {
          type: "date",
          date: { start: new Date().toISOString() },
        },
        [ActionMeta[ActionId.THOUGHT].displayName]: {
          title: [
            {
              text: {
                content: rawData[ActionId.THOUGHT],
              },
            },
          ],
        },
      },
    });
  }
}

exports.NotionManager = NotionManager;
