import { STARTER_GROUPS } from "./data.js";
import { WORLD_CUP_2026_CONTEXT, WORLD_CUP_HISTORY, summarizeHistory } from "./history.js";
import { matchProbabilities, simulateTournament } from "./simulator.js";

const state = {
  groups: cloneGroups(STARTER_GROUPS)
};

const elements = {
  iterations: document.querySelector("#iterations"),
  homeAdvantage: document.querySelector("#homeAdvantage"),
  drawBias: document.querySelector("#drawBias"),
  seed: document.querySelector("#seed"),
  teamA: document.querySelector("#teamA"),
  teamB: document.querySelector("#teamB"),
  matchupResult: document.querySelector("#matchupResult"),
  simulateButton: document.querySelector("#simulateButton"),
  resetButton: document.querySelector("#resetButton"),
  topList: document.querySelector("#topList"),
  summary: document.querySelector("#summary"),
  teamsGrid: document.querySelector("#teamsGrid"),
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

function runSimulation() {
  const options = readOptions();
  elements.status.textContent = "Running";
  elements.simulateButton.disabled = true;

  requestAnimationFrame(() => {
    const startedAt = performance.now();
    const results = simulateTournament(state.groups, options);
    const elapsed = Math.round(performance.now() - startedAt);
    renderResults(results, options.iterations, elapsed);
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
  const teamA = findTeam(elements.teamA.value);
  const teamB = findTeam(elements.teamB.value);
  const probabilities = matchProbabilities(teamA, teamB, readOptions());
  elements.matchupResult.innerHTML = `
    <div class="prob-card"><strong>${formatPercent(probabilities.teamA)}</strong><span>${teamA.name} 常规时间胜</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.draw)}</strong><span>小组赛平局</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.teamB)}</strong><span>${teamB.name} 常规时间胜</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.knockoutA)}</strong><span>${teamA.name} 淘汰赛晋级</span></div>
    <div class="prob-card"><strong>${teamA.elo} / ${teamB.elo}</strong><span>当前 Elo</span></div>
    <div class="prob-card"><strong>${formatPercent(probabilities.knockoutB)}</strong><span>${teamB.name} 淘汰赛晋级</span></div>
  `;
}

function readOptions() {
  return {
    iterations: Number(elements.iterations.value),
    homeAdvantage: Number(elements.homeAdvantage.value),
    drawBias: Number(elements.drawBias.value),
    seed: Number(elements.seed.value)
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
