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
  "app.title": { en: "Football Match Research Dashboard", zh: "足球赛前数据研究控制台" },
  "app.subtitle": { en: "2026 pre-match research · Monte Carlo model", zh: "2026 足球赛前数据研究 · 蒙特卡洛模型" },
  "header.online": { en: "Model online", zh: "模型在线" },
  "header.lastUpdated": { en: "Last updated", zh: "最后更新" },
  "btn.refresh": { en: "Refresh live data", zh: "更新实时数据" },
  "btn.simulate": { en: "Re-run simulation", zh: "重新模拟" },
  "btn.langToggle": { en: "中文", zh: "EN" },
  // tabs
  "tab.overview": { en: "Overview", zh: "赛事总览" },
  "tab.matchAnalysis": { en: "Match Predictions", zh: "对阵预测" },
  "tab.knockout": { en: "Knockout", zh: "晋级图" },
  "tab.history": { en: "History", zh: "历史分析" },
  "tab.teams": { en: "Team Database", zh: "球队数据库" },
  "tab.policy": { en: "Pre-Match Factors", zh: "赛前变量" },
  "tab.settings": { en: "Model Settings", zh: "模型设置" },
  "tab.clubModel": { en: "Data Center", zh: "数据更新中心" },
  // ads + legal
  "ad.label": { en: "Ad", zh: "广告" },
  "ad.home": { en: "Display ad slot", zh: "展示广告位" },
  "ad.bottom": { en: "Bottom display ad slot", zh: "底部展示广告位" },
  "legal.note": { en: "Predictions are for entertainment and research only — not investment, financial, or revenue advice.", zh: "本站预测仅供娱乐和数据研究参考，不构成任何收益、投资或财务建议。" },
  // method guide
  "guide.eyebrow": { en: "Method", zh: "方法说明" },
  "guide.title": { en: "Independent pre-match research, updated as fixtures move", zh: "独立赛前研究，随赛程与赛果持续更新" },
  "guide.body": { en: "This dashboard compares team strength, recent form, coach tendencies, player availability, venue context, travel distance, and public market heat. The free view focuses on fixtures, team context, recent results, head-to-head notes, and a plain-language model readout. Advanced projections are separated behind a compliant rewarded-ad interface when available.", zh: "本站综合球队实力、近期状态、主帅倾向、球员可用性、场地环境、旅行距离和公开市场热度进行赛前研究。免费内容重点展示今日赛程、球队背景、近期表现、历史交锋和模型简析；高级预测在激励广告接口可用时单独解锁展示。" },
  "guide.card1Title": { en: "Fixture context", zh: "赛程背景" },
  "guide.card1Body": { en: "Daily matches, local kickoff time, venue, status, and post-match notes when results are final.", zh: "展示每日比赛、北京时间、场地、状态；赛果确认后补充赛后记录。" },
  "guide.card2Title": { en: "Team research", zh: "球队研究" },
  "guide.card2Body": { en: "Elo baseline, recent form, coach style, core players, and tactical matchup notes.", zh: "覆盖 Elo 基准、近期状态、教练风格、核心球员和战术对抗。" },
  "guide.card3Title": { en: "Transparent limits", zh: "边界透明" },
  "guide.card3Body": { en: "Data sources are mixed public references and manual verification; predictions are estimates, not guarantees.", zh: "数据来自公开资料与人工校验，预测是模型估计，不代表确定结果。" },
  // overview cards
  "ov.topFavorite": { en: "Title favorite", zh: "夺冠头号热门" },
  "calculating": { en: "Calculating", zh: "计算中" },
  "ov.titleOdds": { en: "Title chance · rating", zh: "夺冠概率 · 实力分" },
  "ov.topDarkHorse": { en: "Top dark horse", zh: "头号黑马" },
  "live.title": { en: "Live win probability", zh: "实时胜率" },
  "live.draw": { en: "Draw", zh: "平" },
  // dynamic match-card / status copy (English last-mile)
  "card.simpleLean": { en: "Simple lean", zh: "简单倾向" },
  "card.advanced": { en: "Advanced analysis", zh: "高级分析" },
  "card.advancedLocked": { en: "Score, probabilities, and upset index — unlock to view", zh: "比分、概率、爆冷指数需解锁" },
  "card.statusLive": { en: "Live", zh: "进行中" },
  "card.statusUpcoming": { en: "Upcoming", zh: "待开赛" },
  "card.statusFinal": { en: "Final", zh: "已结束" },
  "card.leanClose": { en: "Too close to call", zh: "双方接近，谨慎看待" },
  "card.unbeatenLean": { en: "lean (unbeaten)", zh: "不败倾向" },
  "post.hit": { en: "Direction hit", zh: "方向命中" },
  "post.miss": { en: "Direction miss", zh: "方向偏离" },
  "post.draw": { en: "Draw", zh: "平局" },
  "post.actual": { en: "Actual", zh: "实际" },
  "post.report": { en: "Post-match report", zh: "赛后分析" },
  "status.updating": { en: "Updating", zh: "更新中" },
  "status.updateFailed": { en: "Update failed", zh: "更新失败" },
  "premium.unlocked": { en: "Advanced analysis unlocked", zh: "高级分析已解锁" },
  "premium.predScore": { en: "Predicted score", zh: "最终比分预测" },
  "premium.wdl": { en: "Win / draw / loss", zh: "胜平负概率" },
  "premium.upsetIndex": { en: "Upset index", zh: "爆冷指数" },
  "premium.confidence": { en: "Model confidence", zh: "模型信心值" },
  "premium.lockedDesc": { en: "Includes predicted score, win/draw/loss probabilities, upset index, model confidence, and a one-line take.", zh: "包含最终比分预测、胜平负概率、爆冷指数、模型信心值和一句话结论。" },
  "premium.unlockBtn": { en: "View advanced analysis", zh: "查看高级分析" },
  "card.coach": { en: "Coach", zh: "主帅" },
  "card.drawShort": { en: "Draw", zh: "平" },
  "time.beijing": { en: "Beijing", zh: "北京" },
  "oddsMove.label": { en: "Market move", zh: "市场异动" },
  "ov.darkHorseMeta": { en: "Reach-QF chance · rating", zh: "进 8 强概率 · 实力分" },
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
  "tomorrow.eyebrow": { en: "Tomorrow", zh: "Tomorrow" },
  "tomorrow.title": { en: "Tomorrow's Matches", zh: "明日比赛" },
  "tomorrow.loading": { en: "Loading tomorrow's fixtures", zh: "读取明日赛程" },
  "tomorrow.empty": { en: "No fixtures scheduled tomorrow", zh: "明日暂无赛程" },
  "upset.eyebrow": { en: "Upset Radar", zh: "Upset Radar" },
  "upset.title": { en: "Upset Radar", zh: "爆冷预测" },
  "upset.loading": { en: "Loading risk fixtures", zh: "读取风险场次" },
  "confidence.eyebrow": { en: "Best Bets", zh: "Best Bets" },
  "confidence.title": { en: "Confidence Picks", zh: "信心之选" },
  "confidence.loading": { en: "Loading top picks", zh: "读取高信心场次" },
  "confidence.top": { en: "Top pick", zh: "头号信心" },
  "confidence.level": { en: "Confidence", zh: "信心" },
  "confidence.locked": { en: "Free view shows the lean and confidence tier; exact win probability and predicted score are in the unlocked report.", zh: "免费版展示倾向与信心等级;精确胜率与预测比分在解锁版展示。" },
  // knockout bracket
  "bracket.eyebrow": { en: "Knockout", zh: "Knockout" },
  "bracket.title": { en: "Knockout Progression", zh: "晋级概率图" },
  "bracket.summary": { en: "Most likely to reach each round (from the current simulation).", zh: "按当前模拟,最可能进入各轮的球队。" },
  // match detail / factor panel
  "detail.back": { en: "← Back to overview", zh: "← 返回总览" },
  "detail.notFound": { en: "Match not found. It may have moved — go back to the overview.", zh: "未找到该场比赛,请返回总览。" },
  "detail.coreFactors": { en: "Core", zh: "核心因子" },
  "detail.homeAdv": { en: "Home advantage", zh: "主场优势" },
  "detail.drawBias": { en: "Draw bias", zh: "平局倾向" },
  "detail.venueClimate": { en: "Venue / Climate", zh: "场地 / 气候" },
  "detail.altitude": { en: "Altitude", zh: "海拔加成" },
  "detail.heat": { en: "Heat tolerance", zh: "高温耐受" },
  "detail.refMarket": { en: "Referee / Market", zh: "裁判 / 市场" },
  "detail.refStrict": { en: "Referee upset boost", zh: "裁判爆冷加成" },
  "detail.marketWeight": { en: "Market blend weight", zh: "市场融合权重" },
  "detail.noMarket": { en: "no market odds for this match", zh: "本场无市场赔率" },
  "detail.modelLayers": { en: "Model layers", zh: "模型层" },
  "detail.starLayer": { en: "Form / stars", zh: "状态 / 球星" },
  "detail.policyLayer": { en: "Policy", zh: "政策" },
  "detail.oddsLayer": { en: "Odds", zh: "赔率" },
  "detail.reset": { en: "Reset factors", zh: "重置因子" },
  "detail.predScore": { en: "Predicted score", zh: "预测比分" },
  "detail.favorite": { en: "Favorite", zh: "占优方" },
  "detail.upsetIndex": { en: "Upset/draw index", zh: "爆冷/平局指数" },
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
  "hist.title": { en: "Tournament Overview", zh: "赛事全图分析" },
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
  "footer.about": { en: "About", zh: "关于本站" },
  "footer.data": { en: "Data Notes", zh: "数据说明" },
  "footer.privacy": { en: "Privacy Policy", zh: "隐私政策" },
  "footer.contact": { en: "Contact Us", zh: "联系我们" },
  "footer.disclaimer": { en: "Disclaimer", zh: "免责声明" },
  "footer.dataBody": { en: "The dashboard combines public match schedules, historical results, team ratings, recent form notes, coach profiles, player availability, venue and travel context, and market-heat references. When a fixture is finished, the model compares the pre-match direction with the actual result and updates downstream summaries.", zh: "本站综合公开赛程、历史赛果、球队评分、近期状态、教练资料、球员可用性、场地与旅途因素、市场热度参考进行分析。比赛结束后，系统会比较赛前方向与真实结果，并更新后续摘要。" },
  "footer.privacyBody": { en: "This site uses browser local storage to remember which match analyses you have unlocked and does not actively collect personally identifiable information. Once third-party ads are integrated, those services may use necessary cookies or similar technologies under their own privacy policies.", zh: "本站使用浏览器本地存储保存用户已解锁的比赛分析状态，不主动收集个人身份信息。接入第三方广告后，广告服务可能依据其隐私政策使用必要的 Cookie 或类似技术。" },
  "footer.contactBody": { en: "For data corrections, ad partnerships, or content fixes, please contact the site operator.", zh: "如需反馈数据问题、广告合作或内容更正，请联系站点运营者。" },
  "footer.disclaimerBody": { en: "Predictions are for entertainment and research only — not investment, financial, or revenue advice. This site has no affiliation with, authorization from, or endorsement by any competition organizer.", zh: "本站预测仅供娱乐和数据研究参考，不构成任何收益、投资或财务建议。本站与任何赛事组织不存在隶属、授权或背书关系。" }
};
