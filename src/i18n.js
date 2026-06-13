// Lightweight i18n. English is the primary language; Chinese is a toggle.
// Choice persists in localStorage. Static HTML uses data-i18n="key" attributes
// (applied by applyStaticTranslations); dynamic JS strings call t(key).

const STORAGE_KEY = "worldcup_lang";
let currentLang = readInitialLang();

function readInitialLang() {
  try {
    const saved = window.localStorage?.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "zh") return saved;
  } catch (error) {
    /* localStorage may be blocked */
  }
  return "en"; // English-first default
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang === "zh" ? "zh" : "en";
  try {
    window.localStorage?.setItem(STORAGE_KEY, currentLang);
  } catch (error) {
    /* ignore */
  }
  try {
    document.documentElement.setAttribute("lang", currentLang === "zh" ? "zh-CN" : "en");
  } catch (error) {
    /* no document (e.g. test runner) */
  }
  return currentLang;
}

export function t(key) {
  const entry = STRINGS[key];
  if (!entry) return key;
  return entry[currentLang] ?? entry.en ?? key;
}

// Applies every [data-i18n] element's text and known attributes.
export function applyStaticTranslations(root = document) {
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (STRINGS[key]) el.textContent = t(key);
  });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (STRINGS[key]) el.setAttribute("aria-label", t(key));
  });
}

export const STRINGS = {
  // header
  "app.title": { en: "World Cup Predictor", zh: "世界杯预测控制台" },
  "app.subtitle": { en: "2026 pre-match data research · Monte Carlo intelligence", zh: "2026 足球赛前数据研究 · 蒙特卡洛情报驾驶舱" },
  "header.online": { en: "Model online", zh: "模型在线" },
  "header.lastUpdated": { en: "Last updated", zh: "最后更新" },
  "btn.refresh": { en: "Refresh live data", zh: "更新实时数据" },
  "btn.simulate": { en: "Re-run simulation", zh: "重新模拟" },
  "btn.langToggle": { en: "中文", zh: "EN" },
  // tabs
  "tab.overview": { en: "Overview", zh: "赛事总览" },
  "tab.matchAnalysis": { en: "Match Predictions", zh: "对阵预测" },
  "tab.history": { en: "History", zh: "历史分析" },
  "tab.teams": { en: "Team Database", zh: "球队数据库" },
  "tab.policy": { en: "Pre-Match Factors", zh: "赛前变量" },
  "tab.settings": { en: "Model Settings", zh: "模型设置" },
  "tab.clubModel": { en: "Data Center", zh: "数据更新中心" },
  // ads + legal
  "ad.label": { en: "Ad", zh: "广告" },
  "ad.home": { en: "Display ad slot", zh: "展示广告位" },
  "ad.bottom": { en: "Bottom display ad slot", zh: "底部展示广告位" },
  "legal.note": { en: "Predictions are for entertainment and research only — not betting, investment, or financial advice.", zh: "本站预测仅供娱乐和数据研究参考，不构成任何收益、投资或财务建议。" },
  // overview cards
  "ov.topFavorite": { en: "Title favorite", zh: "夺冠头号热门" },
  "calculating": { en: "Calculating", zh: "计算中" },
  "ov.titleOdds": { en: "Title odds · rating", zh: "夺冠概率 · 实力分" },
  "ov.confidence": { en: "Model confidence", zh: "模型信心指数" },
  "ov.confidenceClear": { en: "High · clear picture", zh: "高 · 格局清晰" },
  "ov.confidenceNote": { en: "Based on title-distribution concentration", zh: "基于冠军分布集中度" },
  "ov.simScale": { en: "Simulation scale", zh: "模拟规模" },
  "ov.simScaleNote": { en: "12 groups · top 32 by strength", zh: "12 个小组 · 强度前 32 队" },
  "ov.dataStatus": { en: "Data status", zh: "数据状态" },
  "ov.ready": { en: "Ready", zh: "已就绪" },
  // today + upset
  "today.eyebrow": { en: "Today", zh: "Today" },
  "today.title": { en: "Today's Matches", zh: "今日比赛" },
  "today.loading": { en: "Loading today's fixtures", zh: "读取今日赛程" },
  "upset.eyebrow": { en: "Upset Radar", zh: "Upset Radar" },
  "upset.title": { en: "Upset Radar", zh: "爆冷预测" },
  "upset.loading": { en: "Loading risk fixtures", zh: "读取风险场次" },
  // results + sidebar
  "results.title": { en: "2026 Title Probability Ranking", zh: "2026 冠军概率排行" },
  "results.summary": { en: "Monte Carlo frequency", zh: "蒙特卡洛模拟频率" },
  "results.top10": { en: "TOP 10", zh: "TOP 10" },
  "side.readout": { en: "Model readout", zh: "模型解读" },
  "side.readoutDefault": { en: "The model is computing the title favorite, confidence index, and key variables.", zh: "当前模型正在计算冠军头号热门、信心指数和主要变量。" },
  "side.weights": { en: "Key variable weights", zh: "关键变量权重" },
  "side.wElo": { en: "Elo strength weight", zh: "Elo 实力权重" },
  "side.wMarket": { en: "Market-heat weight", zh: "市场热度权重" },
  "side.wStar": { en: "Star-form weight", zh: "球星状态权重" },
  "side.wHistory": { en: "Heritage weight", zh: "历史底蕴权重" },
  "side.updates": { en: "Data update log", zh: "数据更新记录" },
  "side.update1": { en: "Initialized the model and ran the first simulation", zh: "初始化模型并完成首轮模拟" },
  "side.update2": { en: "Loaded team ratings, market heat, and external factors", zh: "接入球队评分、市场热度与外部因素" },
  "side.update3": { en: "Generated the title ranking and model readout", zh: "生成冠军概率排行与模型解读" },
  // settings
  "settings.eyebrow": { en: "Model Settings", zh: "Model Settings" },
  "settings.title": { en: "Model Settings", zh: "模型设置" },
  "settings.iterations": { en: "Simulations", zh: "模拟次数" },
  "settings.homeAdv": { en: "Home advantage (Elo)", zh: "主场加成 Elo" },
  "settings.drawBias": { en: "Draw bias", zh: "平局倾向" },
  "settings.seed": { en: "Random seed", zh: "随机种子" },
  "settings.formModel": { en: "Form adjustment", zh: "状态修正" },
  "settings.formModelSub": { en: "Club / star", zh: "俱乐部/球星" },
  "settings.policyModel": { en: "Policy adjustment", zh: "政策修正" },
  "settings.policyModelSub": { en: "External environment", zh: "外部环境" },
  "settings.oddsModel": { en: "External calibration", zh: "外部校准" },
  "settings.oddsModelSub": { en: "Market snapshot", zh: "市场快照" },
  "btn.reset": { en: "Reset ratings", zh: "重置评分" },
  "matchup.teamA": { en: "Team A", zh: "球队 A" },
  "matchup.teamB": { en: "Team B", zh: "球队 B" },
  // trend
  "trend.eyebrow": { en: "Forecast Trend", zh: "Forecast Trend" },
  "trend.title": { en: "Forecast Trend Analysis", zh: "预测走势分析" },
  "trend.summary": { en: "Probability shift from pure Elo to the full model.", zh: "纯 Elo 到全模型的概率变化。" },
  "trend.titleTrend": { en: "Title probability trend", zh: "夺冠概率走势" },
  "trend.stages": { en: "Pure Elo / Form / Policy / Market", zh: "纯 Elo / 状态 / 政策 / 市场" },
  "trend.risers": { en: "Biggest risers", zh: "上升最快" },
  "trend.fallers": { en: "Biggest fallers", zh: "回落最大" },
  "trend.delta": { en: "Full model − pure Elo", zh: "全模型 - 纯 Elo" },
  // match analysis
  "ma.eyebrow": { en: "Match By Match", zh: "Match By Match" },
  "ma.title": { en: "Match-by-Match Analysis", zh: "每场比赛结果图分析" },
  "ma.summary": { en: "Per-match probabilities for all 72 group games.", zh: "72 场小组赛逐场概率。" },
  // teams
  "teams.eyebrow": { en: "Editable Ratings", zh: "Editable Ratings" },
  "teams.title": { en: "Team Database", zh: "球队数据库" },
  // club model
  "club.eyebrow": { en: "Post Qatar 2022", zh: "Post Qatar 2022" },
  "club.title": { en: "Club / Star Form Model", zh: "俱乐部 / 球星状态模型" },
  "club.summary": { en: "Form adjustments from after the 2022 World Cup through 2026-06-12.", zh: "从 2022 世界杯后到 2026-06-12 的状态修正。" },
  "club.nationalBoost": { en: "National-team form adjustment", zh: "国家队状态修正" },
  "club.clubHeat": { en: "Club heat", zh: "俱乐部热度" },
  "club.compWeight": { en: "Competition weight", zh: "大赛权重" },
  "club.starImpact": { en: "Star impact", zh: "球星影响力" },
  "club.starImpactSub": { en: "Form × role × availability", zh: "状态 x 角色 x 可用性" },
  // national stars
  "ns.eyebrow": { en: "National Star Pool", zh: "National Star Pool" },
  "ns.title": { en: "National Star Data", zh: "各大国家球星数据" },
  "ns.summary": { en: "Core player pools for major nations.", zh: "重点国家核心球员池。" },
  // policy
  "policy.eyebrow": { en: "External Calibration", zh: "External Calibration" },
  "policy.title": { en: "Policy / External Calibration", zh: "国际政策 / 外部校准" },
  "policy.summary": { en: "External-environment adjustment + market-heat calibration.", zh: "外部环境修正 + 市场热度校准。" },
  "policy.envTitle": { en: "Policy & external environment", zh: "政策与外部环境" },
  "policy.marketTitle": { en: "Market-heat reference", zh: "市场热度参考" },
  "policy.marketSub": { en: "Public market snapshot", zh: "公开市场快照" },
  "policy.combined": { en: "Combined external adjustment", zh: "综合外部修正" },
  "policy.combinedSub": { en: "Policy + market", zh: "政策 + 市场" },
  // history
  "hist.eyebrow": { en: "2002 - Now", zh: "2002 - Now" },
  "hist.title": { en: "World Cup Overview", zh: "世界杯全图分析" },
  "hist.summary": { en: "2002-2022 finished editions + 2026 current format.", zh: "2002-2022 完赛届 + 2026 当前赛制。" },
  "hist.goalTrend": { en: "Goal trend", zh: "进球趋势" },
  "hist.goalTrendSub": { en: "Total goals / per match", zh: "总进球 / 场均" },
  "hist.confed": { en: "Champion confederation split", zh: "冠军洲际分布" },
  "hist.finals": { en: "Finals timeline", zh: "决赛时间线" },
  "hist.finalsSub": { en: "Champion, runner-up, third place", zh: "冠军、亚军、三四名" },
  "hist.cup2026": { en: "2026 status", zh: "2026 状态" },
  "hist.cup2026Sub": { en: "Current edition", zh: "当前届" },
  "hist.insights": { en: "Key takeaways", zh: "关键观察" },
  "hist.insightsSub": { en: "Trend summary", zh: "趋势摘要" },
  // footer
  "footer.privacy": { en: "Privacy Policy", zh: "隐私政策" },
  "footer.contact": { en: "Contact Us", zh: "联系我们" },
  "footer.disclaimer": { en: "Disclaimer", zh: "免责声明" },
  "footer.privacyBody": { en: "This site uses browser local storage to remember which match analyses you have unlocked and does not actively collect personally identifiable information. Once third-party ads are integrated, those services may use necessary cookies or similar technologies under their own privacy policies.", zh: "本站使用浏览器本地存储保存用户已解锁的比赛分析状态，不主动收集个人身份信息。接入第三方广告后，广告服务可能依据其隐私政策使用必要的 Cookie 或类似技术。" },
  "footer.contactBody": { en: "For data corrections, ad partnerships, or content fixes, please contact the site operator.", zh: "如需反馈数据问题、广告合作或内容更正，请联系站点运营者。" },
  "footer.disclaimerBody": { en: "Predictions are for entertainment and research only — not betting, investment, or financial advice. This site has no affiliation with, authorization from, or endorsement by any competition organizer.", zh: "本站预测仅供娱乐和数据研究参考，不构成任何收益、投资或财务建议。本站与任何赛事组织不存在隶属、授权或背书关系。" }
};
