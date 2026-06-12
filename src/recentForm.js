export const RECENT_FORM = {
  Canada: {
    source: "Canada results 2020-present, last checked 2026-06-12",
    multiYear: "2022 世界杯小组赛三战皆负但完成重返世界杯；2024 美洲杯首次参赛拿到第四名，证明防守组织和反击能对抗南美强队。",
    summary: "2026 热身 1胜3平，防守稳定但平局偏多；Davies 状态会显著影响左路爆点。",
    matches: [
      recent("2026-03-28", "Iceland", "2-2", "Friendly"),
      recent("2026-03-31", "Tunisia", "0-0", "Friendly"),
      recent("2026-06-01", "Uzbekistan", "2-0", "Friendly"),
      recent("2026-06-05", "Republic of Ireland", "1-1", "Friendly")
    ]
  },
  "Bosnia and Herzegovina": {
    source: "Bosnia records/statistics and pre-match reports, last checked 2026-06-12",
    multiYear: "2014 后长期缺席世界杯；Barbarez 2024 接手后完成换代与凝聚，2026 附加赛连过 Wales、Italy，抗压和点球心态是关键资产。",
    summary: "通过欧洲附加赛进入世界杯，节奏更偏稳守与定位球；完整友谊赛逐场比分待补源。",
    matches: [recent("2026-03-31", "Italy", "1-1", "World Cup qualifying playoff")]
  },
  "United States": {
    source: "United States results page, last checked 2026-06-12",
    multiYear: "2022 世界杯进 16 强；2024 美洲杯小组出局后换帅，Pochettino 周期重点是把主场优势和高压打法重新捏合。",
    summary: "2026 年 3 月热身连续失利，主场首战需要用高压和边路质量修正信心。",
    matches: [
      recent("2026-03-28", "European opponent", "2-5", "Friendly"),
      recent("2026-03-31", "Portugal", "0-2", "Friendly")
    ]
  },
  Paraguay: {
    source: "Paraguay team page and coaching staff, last checked 2026-06-12",
    multiYear: "连续缺席多届世界杯后回归，南美预选赛靠防守韧性、主场强度和关键胜利抢到直接晋级位置。",
    summary: "Alfaro 体系重视低位纪律、对抗和定位球；完整近赛逐场比分待补源。",
    matches: [recent("2026-06-05", "Nicaragua", "score pending", "Friendly / squad reference")]
  }
};

export function recentFormForCountry(country) {
  return RECENT_FORM[country] ?? {
    source: "待接公开赛果源",
    multiYear: "近几年大赛表现待补。",
    summary: "近期热身赛数据待补；当前预测主要依靠 Elo、阵容、主帅和战术模型。",
    matches: []
  };
}

function recent(date, opponent, score, type) {
  return { date, opponent, score, type };
}
