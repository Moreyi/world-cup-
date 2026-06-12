export const COUNTRY_NAMES_ZH = {
  Algeria: "阿尔及利亚",
  Argentina: "阿根廷",
  Australia: "澳大利亚",
  Austria: "奥地利",
  Belgium: "比利时",
  "Bosnia and Herzegovina": "波黑",
  Brazil: "巴西",
  Canada: "加拿大",
  "Cape Verde": "佛得角",
  Colombia: "哥伦比亚",
  Croatia: "克罗地亚",
  Czechia: "捷克",
  "DR Congo": "刚果（金）",
  Ecuador: "厄瓜多尔",
  England: "英格兰",
  France: "法国",
  Germany: "德国",
  Ghana: "加纳",
  Haiti: "海地",
  Iran: "伊朗",
  Iraq: "伊拉克",
  "Ivory Coast": "科特迪瓦",
  Jamaica: "牙买加",
  Japan: "日本",
  Jordan: "约旦",
  Mexico: "墨西哥",
  Morocco: "摩洛哥",
  Netherlands: "荷兰",
  "New Zealand": "新西兰",
  Norway: "挪威",
  Panama: "巴拿马",
  Paraguay: "巴拉圭",
  Portugal: "葡萄牙",
  Qatar: "卡塔尔",
  "Saudi Arabia": "沙特阿拉伯",
  Scotland: "苏格兰",
  Senegal: "塞内加尔",
  Serbia: "塞尔维亚",
  "South Africa": "南非",
  "South Korea": "韩国",
  Spain: "西班牙",
  Sweden: "瑞典",
  Switzerland: "瑞士",
  Tunisia: "突尼斯",
  Turkey: "土耳其",
  "United States": "美国",
  Uruguay: "乌拉圭",
  Uzbekistan: "乌兹别克斯坦"
};

export const CLUB_NAMES_ZH = {
  "AC Milan": "AC米兰",
  "Al Hilal": "利雅得新月",
  "Al Nassr": "利雅得胜利",
  "Athletic Club": "毕尔巴鄂竞技",
  "Atletico Madrid": "马德里竞技",
  "AVS": "AVS",
  Arsenal: "阿森纳",
  Barcelona: "巴塞罗那",
  "Bayer Leverkusen": "勒沃库森",
  "Bayern Munich": "拜仁慕尼黑",
  "Borussia Dortmund": "多特蒙德",
  Bournemouth: "伯恩茅斯",
  "Brighton & Hove Albion": "布莱顿",
  Chelsea: "切尔西",
  "Crystal Palace": "水晶宫",
  "Fenerbahce": "费内巴切",
  Flamengo: "弗拉门戈",
  Fluminense: "弗鲁米嫩塞",
  Galatasaray: "加拉塔萨雷",
  Hoffenheim: "霍芬海姆",
  "Inter Miami": "迈阿密国际",
  "Inter Milan": "国际米兰",
  Juventus: "尤文图斯",
  Leon: "莱昂",
  Liverpool: "利物浦",
  "Los Angeles FC": "洛杉矶FC",
  "Manchester City": "曼城",
  "Manchester United": "曼联",
  Napoli: "那不勒斯",
  "Paris Saint-Germain": "巴黎圣日耳曼",
  Porto: "波尔图",
  "RB Leipzig": "RB莱比锡",
  "Real Madrid": "皇家马德里",
  "Real Sociedad": "皇家社会",
  "San Diego FC": "圣迭戈FC",
  "Villarreal": "比利亚雷亚尔",
  "West Ham United": "西汉姆联",
  Wolverhampton: "狼队"
};

export const POSITION_NAMES_ZH = {
  Defender: "后卫",
  Forward: "前锋",
  Goalkeeper: "门将",
  Midfielder: "中场"
};

export function countryName(name) {
  return COUNTRY_NAMES_ZH[name] ?? name;
}

export function countryListName(value) {
  return value
    .split(" / ")
    .map((name) => countryName(name))
    .join(" / ");
}

export function localizeCountryText(value) {
  return Object.entries(COUNTRY_NAMES_ZH).reduce(
    (text, [englishName, chineseName]) => text.replaceAll(englishName, chineseName),
    value
  );
}

export function clubName(name) {
  return CLUB_NAMES_ZH[name] ?? name;
}

export function positionName(name) {
  return POSITION_NAMES_ZH[name] ?? name;
}
