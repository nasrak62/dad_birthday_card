export const DRAWING_MAPPER_INVERTED = {
  alef: "א",
  bet: "ב",
  gimel: "ג",
  dalet: "ד",
  hay: "ה",
  vav: "ו",
  zain: "ז",
  het: "ח",
  tet: "ט",
  yud: "י",
  haf: "כ",
  lamed: "ל",
  mem: "מ",
  nun: "נ",
  resh: "ר",
  shin: "ש",
  taph: "ת",
  samah: "ס",
  aain: "ע",
  kuf: "ק",
  pey: "פ",
  tzadik: "צ",
};

export const DRAWING_MAPPER = {
  א: "alef",
  ב: "bet",
  ג: "gimel",
  ד: "dalet",
  ה: "hay",
  ו: "vav",
  ז: "zain",
  ח: "het",
  ט: "tet",
  י: "yud",
  כ: "haf",
  ל: "lamed",
  מ: "mem",
  נ: "nun",
  ר: "resh",
  ש: "shin",
  ת: "taph",
  ס: "samah",
  ע: "aain",
  ק: "kuf",
  פ: "pey",
  צ: "tzadik",
  ם: "ם",
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
  "6": "6",
  "7": "7",
  "8": "8",
  "9": "9",
};

export const reverseString = (currentString: string) => {
  return currentString.split("").reverse().join("");
};
