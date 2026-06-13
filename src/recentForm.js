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
  },
  Australia: {
    source: "Socceroos 2026 friendlies (Goal.com / socceroos.com.au), last checked 2026-06-13",
    multiYear: "亚洲区稳定参赛的常客,2022 世界杯闯入 16 强;Popovic 周期强调高强度逼抢与边路冲击,但对强队后防容易被打穿。",
    summary: "赛前热身起伏明显(近 5 战 2胜1平2负、失 6 球):5-1 大胜库拉索亮眼,却 0-3 负哥伦比亚、0-1 负墨西哥,6/6 1-1 平瑞士收官。对土耳其需解决防强队的稳定性。",
    matches: [
      recent("2026-06-06", "Switzerland", "1-1", "Friendly"),
      recent("2026-06-02", "Mexico", "0-1", "Friendly"),
      recent("2026-03-31", "Curacao", "5-1", "Friendly")
    ]
  },
  Turkey: {
    source: "Turkiye 2026 friendlies (Goal.com / FotMob), last checked 2026-06-13",
    multiYear: "Montella 接手后进攻端明显升级,2024 欧洲杯进 8 强;锋线 / 边路个人能力强,问题在防守专注度和客场稳定性。",
    summary: "赛前热身两连胜且零封:6/1 4-0 北马其顿、6/6 2-1 委内瑞拉,进攻火力充足、状态正盛。Elo(1911)明显高于澳大利亚,是 D 组开赛日的实力方。",
    matches: [
      recent("2026-06-06", "Venezuela", "2-1", "Friendly"),
      recent("2026-06-01", "North Macedonia", "4-0", "Friendly")
    ]
  },
  Germany: {
    source: "DFB 2026 friendlies (FourFourTwo / Goal.com), last checked 2026-06-13",
    multiYear: "传统豪门,Nagelsmann 周期以 Wirtz / Musiala / Havertz 为核心重建进攻;2024 主场欧洲杯进 8 强后状态回升。",
    summary: "赛前状态极佳(连胜、进 18 失 5):5/31 4-0 芬兰、2-1 胜美国收官,40 岁的 Neuer 已确认伤愈可出战库拉索。E 组开赛日对鱼腩,主要变数是把握机会的效率。",
    matches: [
      recent("2026-06-07", "United States", "2-1", "Friendly"),
      recent("2026-05-31", "Finland", "4-0", "Friendly")
    ]
  },
  Curacao: {
    source: "Curacao 2026 squad / friendlies (FIFA / FourFourTwo), last checked 2026-06-13",
    multiYear: "队史首次闯入世界杯决赛圈,由荷兰名帅 Dick Advocaat 带队;球员多为荷甲 / 欧洲二线背景,世界杯级别经验有限。",
    summary: "处子秀身份、热身样本偏弱:3/31 1-5 惨负澳大利亚、3/27 0-2 负中国,面对欧洲强队防线压力大。对德国是明显的以弱搏强,失球数是最大风险。",
    matches: [
      recent("2026-05-30", "Scotland", "score pending", "Friendly"),
      recent("2026-03-31", "Australia", "1-5", "Friendly"),
      recent("2026-03-27", "China PR", "0-2", "Friendly")
    ]
  },
  Netherlands: {
    source: "Netherlands 2026 friendlies (ESPN / Goal.com), last checked 2026-06-13",
    multiYear: "稳定的世界强队,2022 世界杯进 8 强、2024 欧洲杯进 4 强;Koeman 体系传控扎实,近年短板在终结效率和大赛临门一脚。",
    summary: "赛前热身喜忧参半:6/3 0-1 爆冷负阿尔及利亚(控球占优但效率低),6/8 2-1 胜乌兹别克回暖。模型只给 41% 正反映对日本并非稳赢,终结效率是关键。",
    matches: [
      recent("2026-06-08", "Uzbekistan", "2-1", "Friendly"),
      recent("2026-06-03", "Algeria", "0-1", "Friendly")
    ]
  },
  Japan: {
    source: "Japan 2026 results (ESPN / Nippon.com), last checked 2026-06-13",
    multiYear: "亚洲一流强队,2022 世界杯小组力压德国 / 西班牙出线;旅欧球员厚度高,擅长快速转换与高位压迫,被视为最危险的'伪弱旅'。",
    summary: "状态火热:3 月热身赛先后 1-0 击败苏格兰与英格兰,5/31 再 1-0 胜冰岛,近 5 战 3 胜、进 11 失 4。Elo(1906)紧咬荷兰,模型把对荷兰列为明日平局 / 爆冷敏感场。",
    matches: [
      recent("2026-05-31", "Iceland", "1-0", "Friendly"),
      recent("2026-03-28", "England", "1-0", "Friendly"),
      recent("2026-03-25", "Scotland", "1-0", "Friendly")
    ]
  },
  "Ivory Coast": {
    source: "Ivory Coast 2026 friendlies (Al Jazeera / ESPN), last checked 2026-06-13",
    multiYear: "2023(2024 初)非洲杯主场夺冠的劲旅,Emerse Fae 带队后凝聚力强;旅欧锋线与边路速度突出,身体对抗占优。",
    summary: "状态强势(近 5 战 4 胜、进 12 失 4):6/4 在南特 2-1 逆转法国(Amad Diallo 绝杀),向世界杯热门发出警告。虽 Elo 低于厄瓜多尔,但绝非鱼腩。",
    matches: [
      recent("2026-06-04", "France", "2-1", "Friendly")
    ]
  },
  Ecuador: {
    source: "Ecuador 2026 friendlies (World Soccer Talk / NBC4), last checked 2026-06-13",
    multiYear: "南美预选赛防守惊艳(18 场仅失 5 球拿 29 分),Beccacece 体系低位坚固、反击犀利;球员年轻、对抗与体能出色。",
    summary: "赛前保持不败、势头极佳:最后一场热身 3-0 胜危地马拉,延续 19 场不败;此前 1-1 平美国、1-1 平墨西哥、0-0 平加拿大。防守是最大资产,模型给 64% 占优。",
    matches: [
      recent("2026-06-07", "Guatemala", "3-0", "Friendly"),
      recent("2026-06-03", "Mexico", "1-1", "Friendly"),
      recent("2026-03-28", "United States", "1-1", "Friendly")
    ]
  },
  Sweden: {
    source: "Sweden 2026 friendlies (ESPN / UEFA), last checked 2026-06-13",
    multiYear: "经历换代的北欧球队,Graham Potter 2025 年 10 月回归后,靠附加赛连过乌克兰、波兰惊险晋级;队长 Lindelöf,打法务实。",
    summary: "赛前状态平平:6/4 0-1 负希腊,进攻乏力。Elo(1712)与突尼斯接近,模型把对突尼斯列为平局敏感场,体能调度在极端高温下是隐患。",
    matches: [
      recent("2026-06-04", "Greece", "0-1", "Friendly")
    ]
  },
  Tunisia: {
    source: "Tunisia 2026 friendlies (ESPN / DailySports), last checked 2026-06-13",
    multiYear: "非洲常客但从未小组出线,Sabri Lamouchi 带队主打防守纪律与定位球;球员个人能力有限,需要整体协防弥补。",
    summary: "赛前状态低迷(近 5 战 1 胜、失 7 球):0-5 惨负比利时、0-1 负奥地利、0-0 平加拿大,仅 1-0 小胜海地。进攻贫瘠是硬伤,但模型给的高温耐受边际(+18)可能在瓜达卢佩夜战帮上忙。",
    matches: [
      recent("2026-06-06", "Belgium", "0-5", "Friendly"),
      recent("2026-06-02", "Austria", "0-1", "Friendly"),
      recent("2026-03-28", "Haiti", "1-0", "Friendly")
    ]
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
