import { STARTER_GROUPS } from "./data.js";
import { buildClubStarModel, getCountryBoost } from "./clubModel.js";
import { WORLD_CUP_2026_CONTEXT, WORLD_CUP_HISTORY, summarizeHistory } from "./history.js";
import { buildGroupMatchAnalysis } from "./matchAnalysis.js";
import { buildPolicyOddsModel, getOddsBoost, getPolicyBoost } from "./policyOddsModel.js";
import { matchProbabilities, simulateTournament } from "./simulator.js";

const state = {
  groups: cloneGroups(STARTER_GROUPS),
  clubStarModel: buildClubStarModel(),
  policyOddsModel: buildPolicyOddsModel()
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
  resetButton: document.querySelector("#resetButton"),
  topList: document.querySelector("#topList"),
  summary: document.querySelector("#summary"),
  matchAnalysisSummary: document.querySelector("#matchAnalysisSummary"),
  matchStats: document.querySelector("#matchStats"),
  matchGroups: document.querySelector("#matchGroups"),
  teamsGrid: document.querySelector("#teamsGrid"),
  clubModelSummary: document.querySelector("#clubModelSummary"),
  clubModelStats: document.querySelector("#clubModelStats"),
  nationalBoostList: document.querySelector("#nationalBoostList"),
  clubPowerList: document.querySelector("#clubPowerList"),
  starImpactGrid: document.querySelector("#starImpactGrid"),
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
renderPolicyOddsModel();
renderHistoryAnalysis();
runSimulation();

elements.simulateButton.addEventListener("click", runSimulation);
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
  elements.status.textContent = "Running";
  elements.simulateButton.disabled = true;

  requestAnimationFrame(() => {
    const startedAt = performance.now();
    const results = simulateTournament(groups, options);
    const elapsed = Math.round(performance.now() - startedAt);
    renderResults(results, options.iterations, elapsed);
    renderMatchAnalysis(groups, options);
    renderMatchup();
    elements.status.textContent = "Done";
    elements.simulateButton.disabled = false;
  });
}

function renderResults(results, iterations, elapsed) {
  const leaders = results.slice(0, 16);
  const max = Math.max(...leaders.map((team) => team.winProbability), 0.01);
  elements.summary.textContent = `${iterations.toLocaleString()} 次模拟，用时 ${elapsed} ms`;
  elements.topList.innerHTML = leaders
    .map(
      (team, index) => `
        <div class="team-row">
          <div class="rank">${index + 1}</div>
          <strong>${team.name}</strong>
          <div class="bar" aria-hidden="true"><div style="width: ${(team.winProbability / max) * 100}%"></div></div>
          <div class="pct">${formatPercent(team.winProbability)}</div>
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
                  <span title="${team.name}">${team.name}</span>
                  <input
                    type="number"
                    min="1200"
                    max="2300"
                    step="5"
                    value="${team.elo}"
                    data-team="${team.name}"
                    aria-label="${team.name} Elo"
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

function renderMatchAnalysis(groups, options) {
  const analysis = buildGroupMatchAnalysis(groups, options);
  const { summary } = analysis;

  elements.matchAnalysisSummary.textContent = `${summary.totalMatches} 场小组赛，${summary.upsetSensitive} 场爆冷/平局敏感`;
  elements.matchStats.innerHTML = `
    <div class="stat-card"><strong>${summary.totalMatches}</strong><span>小组赛场次</span></div>
    <div class="stat-card"><strong>${formatFixture(summary.mostBalanced)}</strong><span>最胶着</span></div>
    <div class="stat-card"><strong>${summary.biggestFavorite.favorite.name}</strong><span>最大优势 ${formatPercent(summary.biggestFavorite.favoriteWinProbability)}</span></div>
    <div class="stat-card"><strong>${formatFixture(summary.highestDraw)}</strong><span>最高平局 ${formatPercent(summary.highestDraw.probabilities.draw)}</span></div>
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

function renderMatchCard(match) {
  return `
    <article class="match-card">
      <div class="match-meta">
        <span>MD${match.matchday} / ${match.window}</span>
        <strong>${match.profile}</strong>
      </div>
      <div class="match-teams">
        <strong>${match.teamA.name}</strong>
        <span>vs</span>
        <strong>${match.teamB.name}</strong>
      </div>
      <div class="result-bars" aria-label="${match.teamA.name} 对 ${match.teamB.name} 赛果概率">
        <div class="result-segment win-a" style="width: ${match.probabilities.teamA * 100}%"></div>
        <div class="result-segment draw" style="width: ${match.probabilities.draw * 100}%"></div>
        <div class="result-segment win-b" style="width: ${match.probabilities.teamB * 100}%"></div>
      </div>
      <div class="match-probs">
        <span>${match.teamA.name} ${formatPercent(match.probabilities.teamA)}</span>
        <span>平 ${formatPercent(match.probabilities.draw)}</span>
        <span>${match.teamB.name} ${formatPercent(match.probabilities.teamB)}</span>
      </div>
      <div class="match-read">
        <span>优势：${match.favorite.name}</span>
        <span>爆冷/平局：${formatPercent(match.upsetOrDrawProbability)}</span>
      </div>
    </article>
  `;
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
    <div class="stat-card"><strong>${topNation.country}</strong><span>最高状态修正 +${topNation.eloBoost}</span></div>
    <div class="stat-card"><strong>${model.clubPower[0].club}</strong><span>最强俱乐部热度</span></div>
    <div class="stat-card"><strong>${model.stars[0].name}</strong><span>最高球星影响</span></div>
    <div class="stat-card"><strong>${latestEvent.label}</strong><span>最新大赛节点</span></div>
  `;

  elements.nationalBoostList.innerHTML = model.nationalBoosts
    .slice(0, 14)
    .map(
      (entry) => `
        <div class="boost-row">
          <span>${entry.country}</span>
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
            <strong>${entry.club}</strong>
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
            <span>${star.country} / ${star.club}</span>
          </div>
          <div class="star-meter" aria-hidden="true"><div style="width: ${(star.impact / maxStar) * 100}%"></div></div>
          <p>${star.note}</p>
        </article>
      `
    )
    .join("");
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
    <div class="stat-card"><strong>${topPolicy.country}</strong><span>最高政策修正 +${topPolicy.policyBoost}</span></div>
    <div class="stat-card"><strong>${topOdds.country}</strong><span>最高赔率隐含 ${formatPercent(topOdds.impliedProbability)}</span></div>
    <div class="stat-card"><strong>${topExternal.country}</strong><span>最高综合外部 +${topExternal.totalExternalBoost}</span></div>
    <div class="stat-card"><strong>${model.oddsRows.length}</strong><span>赔率样本球队</span></div>
  `;

  elements.policyList.innerHTML = model.policyScores
    .slice(0, 14)
    .map(
      (entry) => `
        <div class="boost-row">
          <span>${entry.country}</span>
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
          <span>${entry.country}</span>
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
            <strong>${entry.country}</strong>
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
          <strong>${cup.champion}</strong>
          <span>冠军，对 ${cup.runnerUp}</span>
        </div>
        <div>
          <strong>${cup.goals}</strong>
          <span>总进球</span>
        </div>
        <div>
          <strong>${cup.third}</strong>
          <span>第三名</span>
        </div>
        <p>${cup.finalScore}</p>
      </article>
    `
  ).join("");

  elements.currentCup.innerHTML = `
    <div class="current-badge">${WORLD_CUP_2026_CONTEXT.status}，截至 ${WORLD_CUP_2026_CONTEXT.statusDate}</div>
    <dl>
      <div><dt>东道主</dt><dd>${WORLD_CUP_2026_CONTEXT.hosts}</dd></div>
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
  elements.teamA.innerHTML = teams.map((team) => `<option>${team.name}</option>`).join("");
  elements.teamB.innerHTML = teams.map((team) => `<option>${team.name}</option>`).join("");
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
    <div class="prob-card"><strong>${formatPercent(probabilities.teamA)}</strong><span>${teamA.name} 常规时间胜</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.draw)}</strong><span>小组赛平局</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.teamB)}</strong><span>${teamB.name} 常规时间胜</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.knockoutA)}</strong><span>${teamA.name} 淘汰赛晋级</span></div>
    <div class="prob-card"><strong>${teamA.elo} / ${teamB.elo}</strong><span>${activeBoostLabel(options)}</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.knockoutB)}</strong><span>${teamB.name} 淘汰赛晋级</span></div>
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

function formatFixture(match) {
  return `${match.teamA.name} vs ${match.teamB.name}`;
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
