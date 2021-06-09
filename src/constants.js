export const ActionId = {
  DATE: "DATE",
  EVENT: "EVENT",
  THOUGHT: "THOUGHT",
  THOUGHT_RANK: "THOUGHT_RANK",
  EMOTION: "EMOTION",
  EMOTION_RANK: "EMOTION_RANK",
  START_OVER: "START_OVER",
  CONFIRM: "CONFIRM",
};

// displayName is synced with notion titles -- be careful when change it
export const ActionMeta = {
  [ActionId.DATE]: {
    displayName: "Дата",
    icon: "📅",
  },
  [ActionId.EVENT]: {
    displayName: "Событие",
    icon: "🎪",
  },
  [ActionId.EMOTION]: {
    displayName: "Эмоция",
    icon: "🎭",
  },
  [ActionId.EMOTION_RANK]: {
    displayName: "Сила эмоции",
    icon: "🔢",
  },
  [ActionId.THOUGHT]: {
    displayName: "Мысль",
    icon: "🧠",
  },
  [ActionId.THOUGHT_RANK]: {
    displayName: "Вера в мысль",
    icon: "🔢",
  },
  [ActionId.START_OVER]: {
    displayName: "Сначала",
    icon: "🔁",
  },
  [ActionId.CONFIRM]: {
    displayName: "Отправить",
    icon: "✅",
  },
};

// prettier-ignore
export const EmotionOptions = [
  ["Грусть", "Депрессия", "Безысходность", "Печаль"],
  ["Страх", "Тревога"],
  ["Злость", "Агрессия", "Раздражение"],
  ["Стыд", "Вина"],
  ["Отвращение"],
];
