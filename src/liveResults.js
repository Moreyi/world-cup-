export const RESULT_SNAPSHOT = {
  generatedAt: "2026-06-13 13:20 CST",
  sourceNote: "人工核验比分快照；只录入已结束比赛，未结束比赛继续展示赛前模型概率。",
  sources: [
    {
      name: "ESPN Soccer Scores",
      url: "https://www.espn.com/soccer/scoreboard"
    },
    {
      name: "公开赛程资料参考",
      url: "https://www.espn.com/soccer/schedule"
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
    timeET: "22:00",
    venue: "Estadio Akron, Guadalajara",
    status: "final"
  },
  {
    matchId: "B-1",
    date: "2026-06-12",
    dateTime: "2026-06-12T19:00:00Z",
    timeET: "15:00",
    venue: "BMO Field, Toronto",
    status: "final",
    links: [
      {
        label: "ESPN 比赛页",
        url: "https://www.espn.com/soccer/match/_/gameId/760416"
      },
      {
        label: "公开赛程资料",
        url: "https://www.espn.com/soccer/schedule"
      }
    ]
  },
  {
    matchId: "D-1",
    date: "2026-06-12",
    dateTime: "2026-06-13T01:00:00Z",
    timeET: "21:00",
    venue: "SoFi Stadium, Los Angeles",
    status: "final",
    links: [
      {
        label: "ESPN 比赛页",
        url: "https://www.espn.com/soccer/match/_/gameId/760417"
      },
      {
        label: "公开赛程资料",
        url: "https://www.espn.com/soccer/schedule"
      }
    ]
  }
];

export const MATCH_RESULTS = [
  {
    matchId: "A-1",
    teams: { teamA: "Mexico", teamB: "South Africa" },
    status: "final",
    date: "2026-06-11",
    venue: "Estadio Azteca, Mexico City",
    score: { teamA: 2, teamB: 0 },
    note: "揭幕战，墨西哥拿到 3 分并建立 +2 净胜球。"
  },
  {
    matchId: "A-2",
    teams: { teamA: "South Korea", teamB: "Czechia" },
    status: "final",
    date: "2026-06-11",
    venue: "Estadio Akron, Guadalajara",
    score: { teamA: 2, teamB: 1 },
    note: "韩国赢下小组首战，捷克暂时 0 分。"
  },
  {
    matchId: "B-1",
    teams: { teamA: "Canada", teamB: "Bosnia and Herzegovina" },
    status: "final",
    date: "2026-06-12",
    venue: "BMO Field, Toronto",
    score: { teamA: 1, teamB: 1 },
    note: "加拿大主场追回一球，双方各拿 1 分。"
  },
  {
    matchId: "D-1",
    teams: { teamA: "United States", teamB: "Paraguay" },
    status: "final",
    date: "2026-06-12",
    venue: "SoFi Stadium, Los Angeles",
    score: { teamA: 4, teamB: 1 },
    note: "美国主场大胜拿到 3 分并建立 +3 净胜球。"
  }
];

export function resultByMatchId(matchId) {
  return MATCH_RESULTS.find((result) => result.matchId === matchId) ?? null;
}

export function fixtureByMatchId(matchId) {
  return MATCH_CALENDAR.find((fixture) => fixture.matchId === matchId) ?? null;
}
