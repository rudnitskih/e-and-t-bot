const RecordId = {
  EVENT: "Событие",
  DATE: "Дата",
  THOUGHT: "Мысль",
  THOUGHT_RANK: "Вера в мысль",
  EMOTION: "Эмоция",
  EMOTION_RANK: "Сила эмоции",
};

const ThoughtOptions = [
  ["Грусть", "Депрессия", "Безысходность", "Печаль"],
  ["Страх", "Тревога"],
  ["Злость", "Агрессия", "Раздражение"],
  ["Стыд", "Вина"],
  ["Отвращение"],
];

const RecordIcon = {
  [RecordId.EVENT]: "🎪",
  [RecordId.DATE]: "📅",
  [RecordId.EMOTION]: "🎭",
  [RecordId.EMOTION_RANK]: "🔢",
  [RecordId.THOUGHT]: "🧠",
  [RecordId.THOUGHT_RANK]: "🔢",
};

exports.RecordId = RecordId;
exports.EventPropertyIcons = RecordIcon;
