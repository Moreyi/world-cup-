export const RESULT_SNAPSHOT = {
  generatedAt: "2026-06-12 18:50 CST",
  sourceNote: "人工核验比分快照；只录入已结束比赛，未结束比赛继续展示赛前模型概率。",
  sources: [
    {
      name: "FIFA Match Centre",
      url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026"
    },
    {
      name: "ESPN Soccer Scores",
      url: "https://www.espn.com/soccer/scoreboard"
    }
  ]
};

export const TODAY_DATE = "2026-06-12";

export const MATCH_CALENDAR = [
  {
    matchId: "A-1",
    date: "2026-06-11",
    timeET: "15:00",
    venue: "Mexico City Stadium",
    status: "final"
  },
  {
    matchId: "A-2",
    date: "2026-06-11",
    timeET: "21:00",
    venue: "Estadio Guadalajara",
    status: "final"
  },
  {
    matchId: "B-1",
    date: "2026-06-12",
    dateTime: "2026-06-12T19:00:00Z",
    timeET: "15:00",
    venue: "BMO Field, Toronto",
    status: "scheduled"
  },
  {
    matchId: "D-1",
    date: "2026-06-12",
    dateTime: "2026-06-13T01:00:00Z",
    timeET: "21:00",
    venue: "SoFi Stadium, Los Angeles",
    status: "scheduled"
  }
];

export const MATCH_RESULTS = [
  {
    matchId: "A-1",
    status: "final",
    date: "2026-06-11",
    venue: "Estadio Azteca, Mexico City",
    score: { teamA: 2, teamB: 0 },
    note: "揭幕战，墨西哥拿到 3 分并建立 +2 净胜球。"
  },
  {
    matchId: "A-2",
    status: "final",
    date: "2026-06-11",
    venue: "Estadio Azteca, Mexico City",
    score: { teamA: 2, teamB: 1 },
    note: "韩国赢下小组首战，捷克暂时 0 分。"
  }
];

export function resultByMatchId(matchId) {
  return MATCH_RESULTS.find((result) => result.matchId === matchId) ?? null;
}

export function fixtureByMatchId(matchId) {
  return MATCH_CALENDAR.find((fixture) => fixture.matchId === matchId) ?? null;
}
