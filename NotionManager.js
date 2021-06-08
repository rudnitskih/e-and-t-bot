const axios = require("axios");
const { RecordId } = require("./constants");

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
        [RecordId.DATE]: {
          type: "date",
          date: { start: new Date().toISOString() },
        },
        [RecordId.THOUGHT]: {
          title: [
            {
              text: {
                content: rawData[RecordId.THOUGHT],
              },
            },
          ],
        },
      },
    });
  }
}

exports.NotionManager = NotionManager;
