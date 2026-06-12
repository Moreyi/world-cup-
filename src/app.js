import { STARTER_GROUPS } from "./data.js";
import { buildClubStarModel, getCountryBoost } from "./clubModel.js";
import { WORLD_CUP_2026_CONTEXT, WORLD_CUP_HISTORY, summarizeHistory } from "./history.js";
import { buildGroupMatchAnalysis } from "./matchAnalysis.js?v=20260612-live";
import { NATIONAL_STAR_PROFILES, summarizeNationalStars } from "./nationalStars.js";
import { buildPolicyOddsModel, getOddsBoost, getPolicyBoost } from "./policyOddsModel.js";
import { fetchRealtimeFixtures } from "./realtimeData.js?v=20260612-live";
import { matchProbabilities, simulateTournament } from "./simulator.js";
import { coachForCountry } from "./teamStaff.js";
import { TREND_SCENARIOS, buildForecastTrend } from "./trendAnalysis.js";
import { clubName, countryListName, countryName, localizeCountryText, positionName } from "./localization.js";

const state = {
  groups: cloneGroups(STARTER_GROUPS),
  clubStarModel: buildClubStarModel(),
  policyOddsModel: buildPolicyOddsModel(),
  realtime: {
    fetchedAt: null,
    resultOverrides: [],
    fixtureOverrides: [],
    error: null
  }
};

const elements = {
  iterations: document.querySelector("#iterations"),
  homeAdvantage: document.querySelector("#homeAdvantage"),
  drawBias: document.querySelector("#drawBias"),
  seed: document.querySelector("#seed"),
  useFormModel: document.querySelector("#useFormModel"),
  usePolicyModel: document.querySelector("#usePolicyModel"),
  useOddsModel: document.querySelector("#useOddsModel"),
  teamA: document.querySelector("#teamA"),
  teamB: document.querySelector("#teamB"),
  matchupResult: document.querySelector("#matchupResult"),
  simulateButton: document.querySelector("#simulateButton"),
  refreshLiveButton: document.querySelector("#refreshLiveButton"),
  resetButton: document.querySelector("#resetButton"),
  heroFlag: document.querySelector("#heroFlag"),
  heroTeam: document.querySelector("#heroTeam"),
  heroProbability: document.querySelector("#heroProbability"),
  heroMeta: document.querySelector("#heroMeta"),
  confidenceScore: document.querySelector("#confidenceScore"),
  confidenceLabel: document.querySelector("#confidenceLabel"),
  confidenceNote: document.querySelector("#confidenceNote"),
  simulationScale: document.querySelector("#simulationScale"),
  dataStatusTime: document.querySelector("#dataStatusTime"),
  lastUpdated: document.querySelector("#lastUpdated"),
  modelReadout: document.querySelector("#modelReadout"),
  todaySummary: document.querySelector("#todaySummary"),
  todayMatches: document.querySelector("#todayMatches"),
  upsetSummary: document.querySelector("#upsetSummary"),
  upsetMatches: document.querySelector("#upsetMatches"),
  topList: document.querySelector("#topList"),
  summary: document.querySelector("#summary"),
  trendSummary: document.querySelector("#trendSummary"),
  trendStats: document.querySelector("#trendStats"),
  trendScenarioLabels: document.querySelector("#trendScenarioLabels"),
  trendTable: document.querySelector("#trendTable"),
  trendRisers: document.querySelector("#trendRisers"),
  trendFallers: document.querySelector("#trendFallers"),
  matchAnalysisSummary: document.querySelector("#matchAnalysisSummary"),
  matchStats: document.querySelector("#matchStats"),
  matchGroups: document.querySelector("#matchGroups"),
  teamsGrid: document.querySelector("#teamsGrid"),
  clubModelSummary: document.querySelector("#clubModelSummary"),
  clubModelStats: document.querySelector("#clubModelStats"),
  nationalBoostList: document.querySelector("#nationalBoostList"),
  clubPowerList: document.querySelector("#clubPowerList"),
  starImpactGrid: document.querySelector("#starImpactGrid"),
  nationalStarsSummary: document.querySelector("#nationalStarsSummary"),
  nationalStarsStats: document.querySelector("#nationalStarsStats"),
  nationalStarsGrid: document.querySelector("#nationalStarsGrid"),
  policyOddsSummary: document.querySelector("#policyOddsSummary"),
  policyOddsStats: document.querySelector("#policyOddsStats"),
  policyList: document.querySelector("#policyList"),
  oddsList: document.querySelector("#oddsList"),
  externalBoostGrid: document.querySelector("#externalBoostGrid"),
  oddsDisclaimer: document.querySelector("#oddsDisclaimer"),
  historyStats: document.querySelector("#historyStats"),
  goalChart: document.querySelector("#goalChart"),
  confedChart: document.querySelector("#confedChart"),
  finalsTimeline: document.querySelector("#finalsTimeline"),
  currentCup: document.querySelector("#currentCup"),
  historyInsights: document.querySelector("#historyInsights"),
  historySummary: document.querySelector("#historySummary"),
  status: document.querySelector("#status")
};

renderTeamControls();
renderSelectors();
renderMatchup();
renderClubStarModel();
renderNationalStars();
renderPolicyOddsModel();
renderHistoryAnalysis();
runSimulation();

elements.simulateButton.addEventListener("click", runSimulation);
elements.refreshLiveButton.addEventListener("click", refreshRealtimeData);
elements.resetButton.addEventListener("click", () => {
  state.groups = cloneGroups(STARTER_GROUPS);
  renderTeamControls();
  renderSelectors();
  renderMatchup();
  runSimulation();
});
elements.teamA.addEventListener("change", renderMatchup);
elements.teamB.addEventListener("change", renderMatchup);
elements.homeAdvantage.addEventListener("input", renderMatchup);
elements.drawBias.addEventListener("input", renderMatchup);
elements.useFormModel.addEventListener("change", () => {
  renderMatchup();
  runSimulation();
});
elements.usePolicyModel.addEventListener("change", () => {
  renderMatchup();
  runSimulation();
});
elements.useOddsModel.addEventListener("change", () => {
  renderMatchup();
  runSimulation();
});

function runSimulation() {
  const options = readOptions();
  const groups = applySelectedBoosts(state.groups, options);
  const analysisOptions = withRealtimeOptions(options);
  elements.status.textContent = "Running";
  elements.simulateButton.disabled = true;

  requestAnimationFrame(() => {
    const startedAt = performance.now();
    const analysis = buildGroupMatchAnalysis(groups, analysisOptions);
    const simulationOptions = {
      ...options,
      matchResults: currentFinalMatchResults(analysis)
    };
    const results = simulateTournament(groups, simulationOptions);
    const trend = runTrendAnalysis(simulationOptions);
    const elapsed = Math.round(performance.now() - startedAt);
    renderResults(results, options.iterations, elapsed);
    renderTrendAnalysis(trend);
    renderMatchAnalysis(groups, analysisOptions);
    renderMatchup();
    elements.status.textContent = "Done";
    elements.simulateButton.disabled = false;
  });
}

async function refreshRealtimeData() {
  elements.refreshLiveButton.disabled = true;
  elements.refreshLiveButton.textContent = "更新中";
  elements.status.textContent = "Syncing";
  try {
    const analysis = buildGroupMatchAnalysis(applySelectedBoosts(state.groups, readOptions()), withRealtimeOptions(readOptions()));
    const live = await fetchRealtimeFixtures({ date: analysis.todayDate });
    const mapped = mapRealtimeUpdates(live.updates, analysis.matches);
    state.realtime = {
      fetchedAt: live.fetchedAt,
      resultOverrides: mapped.resultOverrides,
      fixtureOverrides: mapped.fixtureOverrides,
      error: null
    };
    runSimulation();
  } catch (error) {
    state.realtime.error = error.message;
    elements.status.textContent = "更新失败";
  } finally {
    elements.refreshLiveButton.disabled = false;
    elements.refreshLiveButton.textContent = "更新实时数据";
  }
}

function withRealtimeOptions(options) {
  return {
    ...options,
    resultOverrides: state.realtime.resultOverrides,
    fixtureOverrides: state.realtime.fixtureOverrides
  };
}

function currentFinalMatchResults(analysis) {
  return analysis.matches
    .filter((match) => match.result?.status === "final")
    .map((match) => ({
      matchId: match.id,
      status: "final",
      score: match.result.score
    }));
}

function mapRealtimeUpdates(updates, matches) {
  const resultOverrides = [];
  const fixtureOverrides = [];

  for (const update of updates) {
    const match = matches.find((candidate) => sameFixture(candidate, update));
    if (!match) continue;

    fixtureOverrides.push({
      matchId: match.id,
      dateTime: update.dateTime,
      status: update.status,
      venue: formatVenue(update),
      statusText: update.statusText,
      broadcasts: update.broadcasts,
      marketOdds: update.marketOdds
    });

    if (update.status === "live" || update.status === "final") {
      const homeIsTeamA = update.homeTeam === match.teamA.name;
      resultOverrides.push({
        matchId: match.id,
        status: update.status,
        date: match.fixture?.date ?? update.dateTime.slice(0, 10),
        venue: formatVenue(update),
        score: {
          teamA: homeIsTeamA ? update.homeScore : update.awayScore,
          teamB: homeIsTeamA ? update.awayScore : update.homeScore
        },
        note: update.status === "final" ? "实时比分源已标记完赛。" : "实时比分源显示比赛进行中。"
      });
    }
  }

  return { resultOverrides, fixtureOverrides };
}

function sameFixture(match, update) {
  const names = [match.teamA.name, match.teamB.name].sort().join("|");
  const updateNames = [update.homeTeam, update.awayTeam].sort().join("|");
  return names === updateNames;
}

function formatVenue(update) {
  const location = [update.city, update.country].filter(Boolean).join(", ");
  return location ? `${update.venue}, ${location}` : update.venue;
}

function renderResults(results, iterations, elapsed) {
  const leaders = results.slice(0, 16);
  const max = Math.max(...leaders.map((team) => team.winProbability), 0.01);
  const leader = leaders[0];
  const runnerUp = leaders[1];
  const confidence = Math.round(Math.min(94, Math.max(54, leader.winProbability * 230 + (leader.winProbability - runnerUp.winProbability) * 280)));
  const nowText = formatDashboardTime(new Date());

  elements.summary.textContent = `蒙特卡洛 ${iterations.toLocaleString()} 次模拟频率`;
  elements.simulationScale.textContent = iterations.toLocaleString();
  elements.lastUpdated.textContent = nowText;
  elements.dataStatusTime.textContent = nowText;
  elements.heroTeam.textContent = countryName(leader.name);
  elements.heroProbability.textContent = formatPercent(leader.winProbability);
  elements.heroMeta.textContent = `夺冠概率 · 实力分 ${Math.round(leader.elo)}`;
  elements.heroFlag.className = `flag ${flagClass(leader.name)}`;
  elements.confidenceScore.textContent = confidence;
  elements.confidenceLabel.textContent = confidence >= 74 ? "高 · 格局清晰" : confidence >= 62 ? "中 · 竞争开放" : "低 · 变数较大";
  elements.confidenceNote.textContent = confidence >= 74 ? "基于冠军分布集中度" : "热门队差距仍需观察";
  elements.modelReadout.textContent = `当前模型以 ${countryName(leader.name)} 为夺冠头号热门（${formatPercent(
    leader.winProbability
  )}），${countryName(runnerUp.name)} 紧随其后（${formatPercent(
    runnerUp.winProbability
  )}）。信心指数 ${confidence}，主要变量来自 Elo 实力、赔率校准、球星状态与外部环境修正。`;

  elements.topList.innerHTML = leaders
    .map(
      (team, index) => `
        <div class="team-row">
          <div class="rank">${index + 1}</div>
          ${flagMarkup(team.name)}
          <strong>${countryName(team.name)}</strong>
          <div class="bar" aria-hidden="true"><div style="width: ${(team.winProbability / max) * 100}%"></div></div>
          <div class="pct">${formatPercent(team.winProbability)}</div>
        </div>
      `
    )
    .join("");
}

function flagMarkup(country) {
  return `<span class="flag ${flagClass(country)}" aria-hidden="true"></span>`;
}

function flagClass(country) {
  const classes = {
    Argentina: "flag-argentina",
    France: "flag-france",
    Spain: "flag-spain",
    England: "flag-england",
    Brazil: "flag-brazil",
    Portugal: "flag-portugal",
    Netherlands: "flag-netherlands",
    Germany: "flag-germany",
    Belgium: "flag-belgium",
    Uruguay: "flag-uruguay",
    Colombia: "flag-colombia"
  };
  return classes[country] || "flag-generic";
}

function runTrendAnalysis(options) {
  const trendIterations = Math.min(options.iterations, 2000);
  const scenarioResults = {};

  for (const scenario of TREND_SCENARIOS) {
    const scenarioOptions = {
      ...options,
      ...scenario.options,
      iterations: trendIterations
    };
    scenarioResults[scenario.id] = simulateTournament(applySelectedBoosts(state.groups, scenarioOptions), scenarioOptions);
  }

  return {
    ...buildForecastTrend(scenarioResults, TREND_SCENARIOS),
    iterations: trendIterations
  };
}

function renderTrendAnalysis(trend) {
  const maxProbability = Math.max(...trend.leaders.map((row) => row.finalProbability), 0.01);
  elements.trendSummary.textContent = `${trend.iterations.toLocaleString()} 次/阶段，观察 ${trend.scenarios.length} 个模型阶段`;
  elements.trendScenarioLabels.textContent = trend.scenarios.map((scenario) => scenario.label).join(" / ");
  elements.trendStats.innerHTML = `
    <div class="stat-card"><strong>${countryName(trend.summary.leader.name)}</strong><span>全模型最高 ${formatPercent(trend.summary.leader.finalProbability)}</span></div>
    <div class="stat-card"><strong>${countryName(trend.summary.biggestRiser.name)}</strong><span>最大上升 ${formatDelta(trend.summary.biggestRiser.delta)}</span></div>
    <div class="stat-card"><strong>${countryName(trend.summary.biggestFaller.name)}</strong><span>最大回落 ${formatDelta(trend.summary.biggestFaller.delta)}</span></div>
    <div class="stat-card"><strong>${countryName(trend.summary.mostVolatile.name)}</strong><span>波动 ${formatPercent(trend.summary.mostVolatile.volatility)}</span></div>
  `;

  elements.trendTable.innerHTML = trend.leaders
    .map(
      (row, index) => `
        <article class="trend-row">
          <div class="trend-team">
            <span>${index + 1}</span>
            <strong>${countryName(row.name)}</strong>
            <em>${row.direction}</em>
          </div>
          <div class="trend-spark" aria-hidden="true">
            ${row.values
              .map(
                (value) => `
                  <div class="trend-point">
                    <div style="height: ${Math.max(8, (value / maxProbability) * 100)}%"></div>
                  </div>
                `
              )
              .join("")}
          </div>
          <div class="trend-values">
            ${row.values.map((value) => `<span>${formatPercent(value)}</span>`).join("")}
          </div>
          <b class="${row.delta >= 0 ? "positive" : "negative"}">${formatDelta(row.delta)}</b>
        </article>
      `
    )
    .join("");

  elements.trendRisers.innerHTML = renderTrendChangeList(trend.risers);
  elements.trendFallers.innerHTML = renderTrendChangeList(trend.fallers);
}

function renderTrendChangeList(rows) {
  return rows
    .map(
      (row) => `
        <div class="trend-change-row">
          <span>${countryName(row.name)}</span>
          <strong class="${row.delta >= 0 ? "positive" : "negative"}">${formatDelta(row.delta)}</strong>
        </div>
      `
    )
    .join("");
}

function renderTeamControls() {
  elements.teamsGrid.innerHTML = state.groups
    .map(
      (group) => `
        <article class="group-card">
          <div class="group-title">Group ${group.name}</div>
          ${group.teams
            .map(
              (team) => `
                <label class="rating-row">
                  <span title="${countryName(team.name)}">
                    ${countryName(team.name)}
                    <em>主帅：${coachLabel(team.name)}</em>
                  </span>
                  <input
                    type="number"
                    min="1200"
                    max="2300"
                    step="5"
                    value="${team.elo}"
                    data-team="${team.name}"
                    aria-label="${countryName(team.name)} Elo"
                  />
                </label>
              `
            )
            .join("")}
        </article>
      `
    )
    .join("");

  elements.teamsGrid.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      const team = findTeam(input.dataset.team);
      team.elo = Number(input.value);
      renderMatchup();
    });
  });
}

function coachLabel(country) {
  const coach = coachForCountry(country);
  return `${coach.chineseName}${coach.name !== "TBD" ? ` / ${coach.name}` : ""}`;
}

function renderMatchAnalysis(groups, options) {
  const analysis = buildGroupMatchAnalysis(groups, options);
  const { summary } = analysis;

  elements.matchAnalysisSummary.textContent = `${summary.completedMatches} 场已结束，${
    summary.totalMatches - summary.completedMatches
  } 场待赛 · 更新 ${analysis.resultSnapshot.generatedAt}`;
  renderTodayMatches(analysis.todayMatches, analysis.todayDate);
  renderUpsetMatches(analysis.upsetMatches, analysis.todayDate);
  elements.matchStats.innerHTML = `
    <div class="stat-card"><strong>${summary.completedMatches}</strong><span>已结束比赛</span></div>
    <div class="stat-card"><strong>${summary.totalGoals}</strong><span>已结束总进球</span></div>
    <div class="stat-card"><strong>${summary.completedMatches ? `${summary.modelHits}/${summary.completedMatches}` : "--"}</strong><span>赛前方向命中</span></div>
    <div class="stat-card"><strong>${summary.biggestDeviation ? formatFixture(summary.biggestDeviation) : formatFixture(summary.mostBalanced)}</strong><span>${
      summary.biggestDeviation ? "最大赛果偏差" : "最胶着待赛"
    }</span></div>
  `;

  const byGroup = groupBy(analysis.matches, (match) => match.group);
  elements.matchGroups.innerHTML = Object.entries(byGroup)
    .map(
      ([groupName, matches]) => `
        <article class="match-group-card">
          <div class="match-group-title">Group ${groupName}</div>
          <div class="match-list">
            ${matches.map(renderMatchCard).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderTodayMatches(matches, todayDate) {
  const suffix = state.realtime.fetchedAt ? ` · 已实时更新 ${formatDashboardTime(new Date(state.realtime.fetchedAt))}` : "";
  elements.todaySummary.textContent = `${todayDate} · ${matches.length} 场${suffix}`;
  elements.todayMatches.innerHTML = matches.map(renderTodayMatchCard).join("");
}

function renderTodayMatchCard(match) {
  if (match.result?.status === "final" || match.result?.status === "live") return renderCompletedMatchCard(match);

  const fixture = match.fixture;
  const kickoff = formatKickoffTime(fixture);
  const marketOdds = renderMarketOdds(match);
  const statusText = fixture?.status === "live" ? "进行中" : "待开赛";
  return `
    <article class="today-match-card">
      <div class="today-match-meta">
        <span>${kickoff}</span>
        <strong>${statusText}</strong>
      </div>
      <div class="today-match-main">
        <strong>${countryName(match.teamA.name)}</strong>
        <span>vs</span>
        <strong>${countryName(match.teamB.name)}</strong>
      </div>
      <p>${fixture.venue}</p>
      ${marketOdds}
      <div class="today-probs">
        <span>${countryName(match.teamA.name)} ${formatPercent(match.probabilities.teamA)}</span>
        <span>平 ${formatPercent(match.probabilities.draw)}</span>
        <span>${countryName(match.teamB.name)} ${formatPercent(match.probabilities.teamB)}</span>
      </div>
      <div class="result-bars" aria-label="${countryName(match.teamA.name)} 对 ${countryName(match.teamB.name)} 今日赛前概率">
        <div class="result-segment win-a" style="width: ${match.probabilities.teamA * 100}%"></div>
        <div class="result-segment draw" style="width: ${match.probabilities.draw * 100}%"></div>
        <div class="result-segment win-b" style="width: ${match.probabilities.teamB * 100}%"></div>
      </div>
    </article>
  `;
}

function renderMarketOdds(match) {
  const odds = match.fixture?.marketOdds;
  if (!odds?.implied) return "";
  return `
    <div class="market-odds">
      <span>${odds.provider} 赔率风向</span>
      <strong>${countryName(match.teamA.name)} ${formatPercent(odds.implied.home ?? 0)} · 平 ${formatPercent(
        odds.implied.draw ?? 0
      )} · ${countryName(match.teamB.name)} ${formatPercent(odds.implied.away ?? 0)}</strong>
    </div>
  `;
}

function renderUpsetMatches(matches, todayDate) {
  elements.upsetSummary.textContent = `${todayDate} · Top ${matches.length}`;
  elements.upsetMatches.innerHTML = matches
    .map(
      (match) => `
        <article class="upset-card">
          <div class="upset-head">
            <span>${match.fixture?.date === todayDate ? "今日重点" : `Group ${match.group}`}</span>
            <strong>爆冷/平局 ${formatPercent(match.riskScore)}</strong>
          </div>
          <div class="upset-main">
            <strong>${countryName(match.underdog.name)}</strong>
            <span>挑战</span>
            <strong>${countryName(match.favorite.name)}</strong>
          </div>
          <p>弱方赢球 ${formatPercent(match.upsetWinProbability)} · 平局 ${formatPercent(match.probabilities.draw)}</p>
        </article>
      `
    )
    .join("");
}

function renderMatchCard(match) {
  if (match.result?.status === "final") return renderCompletedMatchCard(match);

  return `
    <article class="match-card">
      <div class="match-meta">
        <span>MD${match.matchday} / ${match.window}</span>
        <strong>${match.profile}</strong>
      </div>
      <div class="match-teams">
        <strong>${countryName(match.teamA.name)}</strong>
        <span>vs</span>
        <strong>${countryName(match.teamB.name)}</strong>
      </div>
      <div class="result-bars" aria-label="${countryName(match.teamA.name)} 对 ${countryName(match.teamB.name)} 赛果概率">
        <div class="result-segment win-a" style="width: ${match.probabilities.teamA * 100}%"></div>
        <div class="result-segment draw" style="width: ${match.probabilities.draw * 100}%"></div>
        <div class="result-segment win-b" style="width: ${match.probabilities.teamB * 100}%"></div>
      </div>
      <div class="match-probs">
        <span>${countryName(match.teamA.name)} ${formatPercent(match.probabilities.teamA)}</span>
        <span>平 ${formatPercent(match.probabilities.draw)}</span>
        <span>${countryName(match.teamB.name)} ${formatPercent(match.probabilities.teamB)}</span>
      </div>
      <div class="match-read">
        <span>优势：${countryName(match.favorite.name)}</span>
        <span>爆冷/平局：${formatPercent(match.upsetOrDrawProbability)}</span>
      </div>
    </article>
  `;
}

function renderCompletedMatchCard(match) {
  const { result, postMatch } = match;
  const score = `${result.score.teamA}-${result.score.teamB}`;
  const hitText = postMatch.predictionHit ? "方向命中" : "方向偏离";
  const winnerText = postMatch.actualWinner ? countryName(postMatch.actualWinner.name) : "平局";
  const statusLabel = result.status === "live" ? "进行中" : "已结束";

  return `
    <article class="match-card completed">
      <div class="match-meta">
        <span>${result.date} / ${result.venue}</span>
        <strong class="status-final">${statusLabel}</strong>
      </div>
      <div class="match-teams scoreline">
        <strong>${countryName(match.teamA.name)}</strong>
        <span>${score}</span>
        <strong>${countryName(match.teamB.name)}</strong>
      </div>
      <div class="result-bars" aria-label="${countryName(match.teamA.name)} 对 ${countryName(match.teamB.name)} 赛前概率">
        <div class="result-segment win-a" style="width: ${match.probabilities.teamA * 100}%"></div>
        <div class="result-segment draw" style="width: ${match.probabilities.draw * 100}%"></div>
        <div class="result-segment win-b" style="width: ${match.probabilities.teamB * 100}%"></div>
      </div>
      <div class="match-probs">
        <span>赛前 ${countryName(match.teamA.name)} ${formatPercent(match.probabilities.teamA)}</span>
        <span>平 ${formatPercent(match.probabilities.draw)}</span>
        <span>${countryName(match.teamB.name)} ${formatPercent(match.probabilities.teamB)}</span>
      </div>
      <div class="match-read post-match-read">
        <span>实际：${winnerText} · ${hitText}</span>
        <span>该赛果赛前概率：${formatPercent(postMatch.forecastProbability)}</span>
      </div>
      <div class="post-match-note">
        <strong>赛后分析</strong>
        <p>${buildPostMatchCopy(match)}</p>
      </div>
    </article>
  `;
}

function buildPostMatchCopy(match) {
  const { result, postMatch } = match;
  const teamA = countryName(match.teamA.name);
  const teamB = countryName(match.teamB.name);
  return `${result.note} 模型赛前给到该赛果 ${formatPercent(postMatch.forecastProbability)} 概率；积分影响：${teamA} ${
    postMatch.points.teamA
  } 分（净胜球 ${formatSigned(postMatch.goalDifference.teamA)}），${teamB} ${postMatch.points.teamB} 分（净胜球 ${formatSigned(
    postMatch.goalDifference.teamB
  )}）。`;
}

function formatKickoffTime(fixture = {}) {
  if (fixture.dateTime) {
    const date = new Date(fixture.dateTime);
    return `${formatTimeZoneHour(date, "America/New_York")} ET / ${formatTimeZoneHour(date, "Asia/Shanghai")} 北京`;
  }
  return `今日 ${fixture.timeET} ET`;
}

function formatTimeZoneHour(date, timeZone) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone
  }).format(date);
}

function renderClubStarModel() {
  const model = state.clubStarModel;
  const topNation = model.nationalBoosts[0];
  const latestEvent = model.events[model.events.length - 1];
  const maxBoost = Math.max(...model.nationalBoosts.map((entry) => entry.eloBoost), 1);
  const maxClub = Math.max(...model.clubPower.map((entry) => entry.score), 1);
  const maxStar = Math.max(...model.stars.map((entry) => entry.impact), 1);

  elements.clubModelSummary.textContent = `${model.events.length} 个俱乐部大赛节点，${model.stars.length} 名球星样本，生成于 ${model.generatedAt}`;
  elements.clubModelStats.innerHTML = `
    <div class="stat-card"><strong>${countryName(topNation.country)}</strong><span>最高状态修正 +${topNation.eloBoost}</span></div>
    <div class="stat-card"><strong>${clubName(model.clubPower[0].club)}</strong><span>最强俱乐部热度</span></div>
    <div class="stat-card"><strong>${model.stars[0].name}</strong><span>最高球星影响</span></div>
    <div class="stat-card"><strong>${latestEvent.label}</strong><span>最新大赛节点</span></div>
  `;

  elements.nationalBoostList.innerHTML = model.nationalBoosts
    .slice(0, 14)
    .map(
      (entry) => `
        <div class="boost-row">
      <span>${countryName(entry.country)}</span>
          <div class="boost-track" aria-hidden="true"><div style="width: ${(entry.eloBoost / maxBoost) * 100}%"></div></div>
          <strong>+${entry.eloBoost}</strong>
        </div>
      `
    )
    .join("");

  elements.clubPowerList.innerHTML = model.clubPower
    .slice(0, 10)
    .map(
      (entry) => `
        <div class="club-power-row">
          <div>
            <strong>${clubName(entry.club)}</strong>
            <span>${entry.events.map((event) => `${event.label} ${event.role}`).join(" / ")}</span>
          </div>
          <div class="boost-track" aria-hidden="true"><div style="width: ${(entry.score / maxClub) * 100}%"></div></div>
        </div>
      `
    )
    .join("");

  elements.starImpactGrid.innerHTML = model.stars
    .slice(0, 12)
    .map(
      (star) => `
        <article class="star-card">
          <div>
            <strong>${star.name}</strong>
            <span>${countryName(star.country)} / ${clubName(star.club)}</span>
          </div>
          <div class="star-meter" aria-hidden="true"><div style="width: ${(star.impact / maxStar) * 100}%"></div></div>
          <p>${star.note}</p>
        </article>
      `
    )
    .join("");
}

function renderNationalStars() {
  const summary = summarizeNationalStars(NATIONAL_STAR_PROFILES);
  const maxIndex = Math.max(...summary.profiles.map((profile) => profile.starIndex), 1);
  const topRising = summary.profiles
    .flatMap((profile) => profile.stars.map((star) => ({ ...star, country: profile.country })))
    .filter((star) => star.trend.includes("上升"))
    .sort((a, b) => b.impactScore - a.impactScore)[0];

  elements.nationalStarsSummary.textContent = `${summary.totalCountries} 个重点国家，${summary.totalStars} 名核心球星样本`;
  elements.nationalStarsStats.innerHTML = `
    <div class="stat-card"><strong>${countryName(summary.topProfile.country)}</strong><span>最高球星指数 ${summary.topProfile.starIndex}</span></div>
    <div class="stat-card"><strong>${summary.topProfile.topStar.name}</strong><span>最高影响球星</span></div>
    <div class="stat-card"><strong>${topRising.name}</strong><span>${countryName(topRising.country)} 上升样本</span></div>
    <div class="stat-card"><strong>${summary.totalStars}</strong><span>球星样本数</span></div>
  `;

  elements.nationalStarsGrid.innerHTML = summary.profiles
    .map(
      (profile) => `
        <article class="national-star-card">
          <div class="national-star-head">
            <div>
              <strong>${countryName(profile.country)}</strong>
              <span>${profile.tier}</span>
            </div>
            <b>${profile.starIndex}</b>
          </div>
          <div class="star-index-track" aria-hidden="true"><div style="width: ${(profile.starIndex / maxIndex) * 100}%"></div></div>
          <p>${profile.outlook}</p>
          <div class="country-star-list">
            ${profile.stars.map(renderCountryStar).join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderCountryStar(star) {
  return `
    <div class="country-star-row">
      <div>
        <strong>${star.shortName} <em>${star.chineseName}</em></strong>
        <span>${star.name} · ${positionName(star.position)} / ${clubName(star.club)}</span>
      </div>
      <div>
        <b>${star.impactScore}</b>
        <span>${formatMarketValue(star.marketValueEurM)} · ${star.trend}</span>
      </div>
    </div>
  `;
}

function renderPolicyOddsModel() {
  const model = state.policyOddsModel;
  const topPolicy = model.policyScores[0];
  const topOdds = model.oddsRows[0];
  const topExternal = model.combinedRows[0];
  const maxPolicy = Math.max(...model.policyScores.map((entry) => Math.abs(entry.policyBoost)), 1);
  const maxOdds = Math.max(...model.oddsRows.map((entry) => entry.impliedProbability), 0.01);
  const maxExternal = Math.max(...model.combinedRows.map((entry) => Math.abs(entry.totalExternalBoost)), 1);

  elements.policyOddsSummary.textContent = `${model.policyFactors.length} 类政策/环境因子，${model.oddsRows.length} 队赔率快照，生成于 ${model.generatedAt}`;
  elements.policyOddsStats.innerHTML = `
    <div class="stat-card"><strong>${countryName(topPolicy.country)}</strong><span>最高政策修正 +${topPolicy.policyBoost}</span></div>
    <div class="stat-card"><strong>${countryName(topOdds.country)}</strong><span>最高赔率隐含 ${formatPercent(topOdds.impliedProbability)}</span></div>
    <div class="stat-card"><strong>${countryName(topExternal.country)}</strong><span>最高综合外部 +${topExternal.totalExternalBoost}</span></div>
    <div class="stat-card"><strong>${model.oddsRows.length}</strong><span>赔率样本球队</span></div>
  `;

  elements.policyList.innerHTML = model.policyScores
    .slice(0, 14)
    .map(
      (entry) => `
        <div class="boost-row">
          <span>${countryName(entry.country)}</span>
          <div class="boost-track ${entry.policyBoost < 0 ? "negative" : ""}" aria-hidden="true">
            <div style="width: ${(Math.abs(entry.policyBoost) / maxPolicy) * 100}%"></div>
          </div>
          <strong>${signed(entry.policyBoost)}</strong>
        </div>
      `
    )
    .join("");

  elements.oddsList.innerHTML = model.oddsRows
    .map(
      (entry) => `
        <div class="odds-row">
          <span>${countryName(entry.country)}</span>
          <div class="boost-track" aria-hidden="true"><div style="width: ${(entry.impliedProbability / maxOdds) * 100}%"></div></div>
          <strong>+${entry.american}</strong>
          <em>${formatPercent(entry.impliedProbability)}</em>
        </div>
      `
    )
    .join("");

  elements.externalBoostGrid.innerHTML = model.combinedRows
    .slice(0, 16)
    .map(
      (entry) => `
        <article class="external-card">
          <div>
            <strong>${countryName(entry.country)}</strong>
            <span>政策 ${signed(entry.policyBoost)} / 赔率 ${signed(entry.oddsBoost)}</span>
          </div>
          <div class="boost-track ${entry.totalExternalBoost < 0 ? "negative" : ""}" aria-hidden="true">
            <div style="width: ${(Math.abs(entry.totalExternalBoost) / maxExternal) * 100}%"></div>
          </div>
          <b>${signed(entry.totalExternalBoost)}</b>
        </article>
      `
    )
    .join("");

  elements.oddsDisclaimer.textContent = model.note;
}

function renderHistoryAnalysis() {
  const summary = summarizeHistory(WORLD_CUP_HISTORY);
  const maxGoals = Math.max(...WORLD_CUP_HISTORY.map((cup) => cup.goals));
  const titleEntries = Object.entries(summary.confederationTitles).sort((a, b) => b[1] - a[1]);

  elements.historySummary.textContent = `${summary.editions} 届完赛世界杯，${summary.totalGoals} 球，场均 ${summary.goalsPerMatch.toFixed(2)} 球`;
  elements.historyStats.innerHTML = `
    <div class="stat-card"><strong>${summary.editions}</strong><span>完赛届数</span></div>
    <div class="stat-card"><strong>${summary.totalGoals}</strong><span>总进球</span></div>
    <div class="stat-card"><strong>${summary.goalsPerMatch.toFixed(2)}</strong><span>场均进球</span></div>
    <div class="stat-card"><strong>${WORLD_CUP_2026_CONTEXT.teams}</strong><span>2026 扩军球队</span></div>
  `;

  elements.goalChart.innerHTML = WORLD_CUP_HISTORY.map((cup) => {
    const width = (cup.goals / maxGoals) * 100;
    return `
      <div class="goal-row">
        <span>${cup.year}</span>
        <div class="goal-track" aria-hidden="true"><div style="width: ${width}%"></div></div>
        <strong>${cup.goals}</strong>
        <em>${(cup.goals / cup.matches).toFixed(2)}</em>
      </div>
    `;
  }).join("");

  elements.confedChart.innerHTML = titleEntries
    .map(([confederation, titles]) => {
      const width = (titles / summary.editions) * 100;
      return `
        <div class="confed-row">
          <div>
            <strong>${confederation}</strong>
            <span>${titles} 次冠军，${summary.finalistConfederations[confederation] ?? 0} 次决赛席位</span>
          </div>
          <div class="confed-track" aria-hidden="true"><div style="width: ${width}%"></div></div>
        </div>
      `;
    })
    .join("");

  elements.finalsTimeline.innerHTML = WORLD_CUP_HISTORY.map(
    (cup) => `
      <article class="final-card">
        <div class="final-year">${cup.year}</div>
        <div>
          <strong>${countryName(cup.champion)}</strong>
          <span>冠军，对 ${countryName(cup.runnerUp)}</span>
        </div>
        <div>
          <strong>${cup.goals}</strong>
          <span>总进球</span>
        </div>
        <div>
          <strong>${countryName(cup.third)}</strong>
          <span>第三名</span>
        </div>
        <p>${localizeCountryText(cup.finalScore)}</p>
      </article>
    `
  ).join("");

  elements.currentCup.innerHTML = `
    <div class="current-badge">${WORLD_CUP_2026_CONTEXT.status}，截至 ${WORLD_CUP_2026_CONTEXT.statusDate}</div>
    <dl>
      <div><dt>东道主</dt><dd>${countryListName(WORLD_CUP_2026_CONTEXT.hosts)}</dd></div>
      <div><dt>赛程</dt><dd>${WORLD_CUP_2026_CONTEXT.startDate} - ${WORLD_CUP_2026_CONTEXT.finalDate}</dd></div>
      <div><dt>规模</dt><dd>${WORLD_CUP_2026_CONTEXT.teams} 队，${WORLD_CUP_2026_CONTEXT.matches} 场</dd></div>
      <div><dt>赛制</dt><dd>${WORLD_CUP_2026_CONTEXT.groups} 个小组，${WORLD_CUP_2026_CONTEXT.knockoutStart} 起淘汰赛</dd></div>
    </dl>
    <p>${WORLD_CUP_2026_CONTEXT.note}</p>
  `;

  elements.historyInsights.innerHTML = buildHistoryInsights(summary)
    .map((insight) => `<li>${insight}</li>`)
    .join("");
}

function renderSelectors() {
  const teams = allTeams();
  elements.teamA.innerHTML = teams.map((team) => `<option value="${team.name}">${countryName(team.name)}</option>`).join("");
  elements.teamB.innerHTML = teams.map((team) => `<option value="${team.name}">${countryName(team.name)}</option>`).join("");
  elements.teamA.value = "Argentina";
  elements.teamB.value = "France";
}

function renderMatchup() {
  const baseTeamA = findTeam(elements.teamA.value);
  const baseTeamB = findTeam(elements.teamB.value);
  const options = readOptions();
  const teamA = withSelectedBoosts(baseTeamA, options);
  const teamB = withSelectedBoosts(baseTeamB, options);
  const probabilities = matchProbabilities(teamA, teamB, readOptions());
  elements.matchupResult.innerHTML = `
    <div class="prob-card"><strong>${formatPercent(probabilities.teamA)}</strong><span>${countryName(teamA.name)} 常规时间胜</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.draw)}</strong><span>小组赛平局</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.teamB)}</strong><span>${countryName(teamB.name)} 常规时间胜</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.knockoutA)}</strong><span>${countryName(teamA.name)} 淘汰赛晋级</span></div>
    <div class="prob-card"><strong>${teamA.elo} / ${teamB.elo}</strong><span>${activeBoostLabel(options)}</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.knockoutB)}</strong><span>${countryName(teamB.name)} 淘汰赛晋级</span></div>
  `;
}

function readOptions() {
  return {
    iterations: Number(elements.iterations.value),
    homeAdvantage: Number(elements.homeAdvantage.value),
    drawBias: Number(elements.drawBias.value),
    seed: Number(elements.seed.value),
    useFormModel: elements.useFormModel.checked,
    usePolicyModel: elements.usePolicyModel.checked,
    useOddsModel: elements.useOddsModel.checked
  };
}

function allTeams() {
  return state.groups.flatMap((group) =>
    group.teams.map((team) => ({
      ...team,
      group: group.name
    }))
  );
}

function findTeam(name) {
  const team = state.groups.flatMap((group) => group.teams).find((candidate) => candidate.name === name);
  if (!team) throw new Error(`Unknown team: ${name}`);
  return team;
}

function cloneGroups(groups) {
  return groups.map((group) => ({
    ...group,
    teams: group.teams.map((team) => ({ ...team }))
  }));
}

function formatPercent(value) {
  return `${(value * 100).toFixed(value < 0.01 ? 2 : 1)}%`;
}

function formatDashboardTime(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const time = [date.getHours(), date.getMinutes(), date.getSeconds()].map((part) => String(part).padStart(2, "0")).join(":");
  return `${month}月${day}日 ${time}`;
}

function formatDelta(value) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(1)}pp`;
}

function formatSigned(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function formatMarketValue(value) {
  if (!Number.isFinite(value)) return "身价待核";
  if (value >= 100) return `€${Math.round(value)}m`;
  if (value >= 10) return `€${value.toFixed(value % 1 === 0 ? 0 : 1)}m`;
  return `€${value.toFixed(1)}m`;
}

function formatFixture(match) {
  return `${countryName(match.teamA.name)} vs ${countryName(match.teamB.name)}`;
}

function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    groups[key] = groups[key] ?? [];
    groups[key].push(item);
    return groups;
  }, {});
}

function applySelectedBoosts(groups, options) {
  return groups.map((group) => ({
    ...group,
    teams: group.teams.map((team) => withSelectedBoosts(team, options))
  }));
}

function withSelectedBoosts(team, options) {
  const formBoost = options.useFormModel ? getCountryBoost(state.clubStarModel, team.name) : 0;
  const policyBoost = options.usePolicyModel ? getPolicyBoost(state.policyOddsModel, team.name) : 0;
  const oddsBoost = options.useOddsModel ? getOddsBoost(state.policyOddsModel, team.name) : 0;
  return {
    ...team,
    elo: team.elo + formBoost + policyBoost + oddsBoost,
    baseElo: team.elo,
    formBoost,
    policyBoost,
    oddsBoost
  };
}

function activeBoostLabel(options) {
  const labels = [];
  if (options.useFormModel) labels.push("状态");
  if (options.usePolicyModel) labels.push("政策");
  if (options.useOddsModel) labels.push("赔率");
  return labels.length > 0 ? `${labels.join("+")}修正 Elo` : "当前 Elo";
}

function signed(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function buildHistoryInsights(summary) {
  const [mostFinalsTeam, mostFinalsCount] = summary.mostFinals[0];
  const uefaTitles = summary.confederationTitles.UEFA ?? 0;
  const conmebolTitles = summary.confederationTitles.CONMEBOL ?? 0;
  return [
    `2002-2022 的 ${summary.editions} 届里，UEFA 拿到 ${uefaTitles} 冠，CONMEBOL 拿到 ${conmebolTitles} 冠。`,
    `${summary.highestScoring.year} 是这一段最高产的一届，共 ${summary.highestScoring.goals} 球。`,
    `${summary.lowestScoring.year} 是这一段最低产的一届，共 ${summary.lowestScoring.goals} 球。`,
    `${mostFinalsTeam} 是这段样本里决赛出现最多的球队之一，共 ${mostFinalsCount} 次。`,
    "2026 扩军到 48 队和 104 场后，历史总量指标需要单独比较，不能直接和 32 队时代等比例对照。"
  ];
}
