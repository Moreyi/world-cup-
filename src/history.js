export const WORLD_CUP_HISTORY = [
  {
    year: 2002,
    hosts: "South Korea / Japan",
    champion: "Brazil",
    runnerUp: "Germany",
    third: "Turkey",
    fourth: "South Korea",
    championConfederation: "CONMEBOL",
    finalistConfederations: ["CONMEBOL", "UEFA"],
    teams: 32,
    matches: 64,
    goals: 161,
    finalScore: "Brazil 2-0 Germany",
    hostBestFinish: "4th"
  },
  {
    year: 2006,
    hosts: "Germany",
    champion: "Italy",
    runnerUp: "France",
    third: "Germany",
    fourth: "Portugal",
    championConfederation: "UEFA",
    finalistConfederations: ["UEFA", "UEFA"],
    teams: 32,
    matches: 64,
    goals: 147,
    finalScore: "Italy 1-1 France, 5-3 pens",
    hostBestFinish: "3rd"
  },
  {
    year: 2010,
    hosts: "South Africa",
    champion: "Spain",
    runnerUp: "Netherlands",
    third: "Germany",
    fourth: "Uruguay",
    championConfederation: "UEFA",
    finalistConfederations: ["UEFA", "UEFA"],
    teams: 32,
    matches: 64,
    goals: 145,
    finalScore: "Spain 1-0 Netherlands",
    hostBestFinish: "Group stage"
  },
  {
    year: 2014,
    hosts: "Brazil",
    champion: "Germany",
    runnerUp: "Argentina",
    third: "Netherlands",
    fourth: "Brazil",
    championConfederation: "UEFA",
    finalistConfederations: ["UEFA", "CONMEBOL"],
    teams: 32,
    matches: 64,
    goals: 171,
    finalScore: "Germany 1-0 Argentina",
    hostBestFinish: "4th"
  },
  {
    year: 2018,
    hosts: "Russia",
    champion: "France",
    runnerUp: "Croatia",
    third: "Belgium",
    fourth: "England",
    championConfederation: "UEFA",
    finalistConfederations: ["UEFA", "UEFA"],
    teams: 32,
    matches: 64,
    goals: 169,
    finalScore: "France 4-2 Croatia",
    hostBestFinish: "Quarter-finals"
  },
  {
    year: 2022,
    hosts: "Qatar",
    champion: "Argentina",
    runnerUp: "France",
    third: "Croatia",
    fourth: "Morocco",
    championConfederation: "CONMEBOL",
    finalistConfederations: ["CONMEBOL", "UEFA"],
    teams: 32,
    matches: 64,
    goals: 172,
    finalScore: "Argentina 3-3 France, 4-2 pens",
    hostBestFinish: "Group stage"
  }
];

export const WORLD_CUP_2026_CONTEXT = {
  year: 2026,
  hosts: "Canada / Mexico / United States",
  status: "进行中",
  statusDate: "2026-06-12",
  teams: 48,
  matches: 104,
  groups: 12,
  groupSize: 4,
  knockoutStart: "Round of 32",
  startDate: "2026-06-11",
  finalDate: "2026-07-19",
  note: "2026 届仍在进行中，本页历史图表只把 2002-2022 完赛届纳入冠军和进球趋势统计。"
};

export function summarizeHistory(history = WORLD_CUP_HISTORY) {
  const totals = history.reduce(
    (summary, tournament) => {
      summary.goals += tournament.goals;
      summary.matches += tournament.matches;
      summary.confederationTitles[tournament.championConfederation] =
        (summary.confederationTitles[tournament.championConfederation] ?? 0) + 1;
      for (const confederation of tournament.finalistConfederations) {
        summary.finalistConfederations[confederation] = (summary.finalistConfederations[confederation] ?? 0) + 1;
      }
      summary.finalists[tournament.champion] = (summary.finalists[tournament.champion] ?? 0) + 1;
      summary.finalists[tournament.runnerUp] = (summary.finalists[tournament.runnerUp] ?? 0) + 1;
      return summary;
    },
    {
      goals: 0,
      matches: 0,
      confederationTitles: {},
      finalistConfederations: {},
      finalists: {}
    }
  );

  return {
    editions: history.length,
    totalGoals: totals.goals,
    totalMatches: totals.matches,
    goalsPerMatch: totals.goals / totals.matches,
    highestScoring: history.reduce((best, current) => (current.goals > best.goals ? current : best), history[0]),
    lowestScoring: history.reduce((best, current) => (current.goals < best.goals ? current : best), history[0]),
    confederationTitles: totals.confederationTitles,
    finalistConfederations: totals.finalistConfederations,
    mostFinals: Object.entries(totals.finalists).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  };
}

