export const CLUB_FORM_EVENTS = [
  {
    date: "2023-06-10",
    label: "2023 Champions League",
    winner: "Manchester City",
    runnerUp: "Inter Milan",
    importance: 1,
    recency: 0.72
  },
  {
    date: "2023-12-22",
    label: "2023 Club World Cup",
    winner: "Manchester City",
    runnerUp: "Fluminense",
    importance: 0.75,
    recency: 0.76
  },
  {
    date: "2024-06-01",
    label: "2024 Champions League",
    winner: "Real Madrid",
    runnerUp: "Borussia Dortmund",
    importance: 1,
    recency: 0.84
  },
  {
    date: "2025-05-31",
    label: "2025 Champions League",
    winner: "Paris Saint-Germain",
    runnerUp: "Inter Milan",
    importance: 1,
    recency: 0.94
  },
  {
    date: "2025-07-13",
    label: "2025 Club World Cup",
    winner: "Chelsea",
    runnerUp: "Paris Saint-Germain",
    importance: 0.86,
    recency: 0.96
  },
  {
    date: "2025-12-17",
    label: "2025 Intercontinental Cup",
    winner: "Paris Saint-Germain",
    runnerUp: "Flamengo",
    importance: 0.7,
    recency: 0.98
  },
  {
    date: "2026-05-30",
    label: "2026 Champions League",
    winner: "Paris Saint-Germain",
    runnerUp: "Arsenal",
    importance: 1,
    recency: 1
  }
];

export const CLUB_COUNTRY_LINKS = {
  "Paris Saint-Germain": [
    { country: "France", share: 0.34 },
    { country: "Portugal", share: 0.16 },
    { country: "Morocco", share: 0.12 },
    { country: "Brazil", share: 0.1 }
  ],
  "Real Madrid": [
    { country: "Brazil", share: 0.24 },
    { country: "England", share: 0.18 },
    { country: "France", share: 0.16 },
    { country: "Uruguay", share: 0.12 },
    { country: "Spain", share: 0.1 }
  ],
  "Manchester City": [
    { country: "England", share: 0.22 },
    { country: "Spain", share: 0.18 },
    { country: "Norway", share: 0.14 },
    { country: "Portugal", share: 0.12 },
    { country: "Argentina", share: 0.08 }
  ],
  Chelsea: [
    { country: "England", share: 0.28 },
    { country: "Argentina", share: 0.12 },
    { country: "Ecuador", share: 0.1 },
    { country: "Spain", share: 0.08 },
    { country: "Brazil", share: 0.08 }
  ],
  Arsenal: [
    { country: "England", share: 0.3 },
    { country: "France", share: 0.14 },
    { country: "Brazil", share: 0.12 },
    { country: "Norway", share: 0.1 },
    { country: "Spain", share: 0.08 }
  ],
  "Inter Milan": [
    { country: "Argentina", share: 0.2 },
    { country: "Italy", share: 0.18 },
    { country: "France", share: 0.1 },
    { country: "Netherlands", share: 0.1 }
  ],
  Barcelona: [
    { country: "Spain", share: 0.32 },
    { country: "Brazil", share: 0.14 },
    { country: "Netherlands", share: 0.1 },
    { country: "France", share: 0.08 }
  ],
  "Bayern Munich": [
    { country: "Germany", share: 0.3 },
    { country: "England", share: 0.14 },
    { country: "France", share: 0.12 },
    { country: "Netherlands", share: 0.08 }
  ],
  "Bayer Leverkusen": [
    { country: "Germany", share: 0.26 },
    { country: "Netherlands", share: 0.12 },
    { country: "Spain", share: 0.1 },
    { country: "Czechia", share: 0.08 }
  ]
};

export const STAR_FORM = [
  {
    name: "Ousmane Dembele",
    country: "France",
    club: "Paris Saint-Germain",
    position: "Forward",
    form: 96,
    influence: 0.95,
    availability: 0.92,
    note: "PSG 近两季欧冠核心攻击点"
  },
  {
    name: "Kylian Mbappe",
    country: "France",
    club: "Real Madrid",
    position: "Forward",
    form: 94,
    influence: 1,
    availability: 0.95,
    note: "法国进攻上限和淘汰赛决定性"
  },
  {
    name: "Lamine Yamal",
    country: "Spain",
    club: "Barcelona",
    position: "Forward",
    form: 93,
    influence: 0.9,
    availability: 0.9,
    note: "西班牙边路创造力核心"
  },
  {
    name: "Vinicius Junior",
    country: "Brazil",
    club: "Real Madrid",
    position: "Forward",
    form: 92,
    influence: 0.94,
    availability: 0.9,
    note: "皇马欧冠周期里的关键爆点"
  },
  {
    name: "Jude Bellingham",
    country: "England",
    club: "Real Madrid",
    position: "Midfielder",
    form: 91,
    influence: 0.92,
    availability: 0.9,
    note: "英格兰中前场连接和禁区冲击"
  },
  {
    name: "Bukayo Saka",
    country: "England",
    club: "Arsenal",
    position: "Forward",
    form: 90,
    influence: 0.9,
    availability: 0.9,
    note: "阿森纳和英格兰右路稳定输出"
  },
  {
    name: "Harry Kane",
    country: "England",
    club: "Bayern Munich",
    position: "Forward",
    form: 90,
    influence: 0.92,
    availability: 0.88,
    note: "中锋终结、回撤组织和定位球价值"
  },
  {
    name: "Rodri",
    country: "Spain",
    club: "Manchester City",
    position: "Midfielder",
    form: 89,
    influence: 0.96,
    availability: 0.78,
    note: "健康状态决定西班牙和曼城中场下限"
  },
  {
    name: "Cole Palmer",
    country: "England",
    club: "Chelsea",
    position: "Forward",
    form: 89,
    influence: 0.82,
    availability: 0.9,
    note: "2025 世俱杯后俱乐部热度显著上升"
  },
  {
    name: "Erling Haaland",
    country: "Norway",
    club: "Manchester City",
    position: "Forward",
    form: 89,
    influence: 0.94,
    availability: 0.9,
    note: "高终结效率，但国家队整体平台较弱"
  },
  {
    name: "Vitinha",
    country: "Portugal",
    club: "Paris Saint-Germain",
    position: "Midfielder",
    form: 88,
    influence: 0.86,
    availability: 0.92,
    note: "PSG 控球和压迫节奏核心"
  },
  {
    name: "Jamal Musiala",
    country: "Germany",
    club: "Bayern Munich",
    position: "Midfielder",
    form: 88,
    influence: 0.86,
    availability: 0.87,
    note: "德国前场破局能力"
  },
  {
    name: "Florian Wirtz",
    country: "Germany",
    club: "Bayer Leverkusen",
    position: "Midfielder",
    form: 88,
    influence: 0.86,
    availability: 0.88,
    note: "勒沃库森周期带来的创造力样本"
  },
  {
    name: "Lautaro Martinez",
    country: "Argentina",
    club: "Inter Milan",
    position: "Forward",
    form: 87,
    influence: 0.88,
    availability: 0.9,
    note: "国米多次欧冠决赛周期核心"
  },
  {
    name: "Julian Alvarez",
    country: "Argentina",
    club: "Atletico Madrid",
    position: "Forward",
    form: 86,
    influence: 0.82,
    availability: 0.9,
    note: "国家队多功能前场补强"
  },
  {
    name: "Federico Valverde",
    country: "Uruguay",
    club: "Real Madrid",
    position: "Midfielder",
    form: 86,
    influence: 0.86,
    availability: 0.9,
    note: "乌拉圭中场覆盖和皇马大赛经验"
  },
  {
    name: "Achraf Hakimi",
    country: "Morocco",
    club: "Paris Saint-Germain",
    position: "Defender",
    form: 86,
    influence: 0.82,
    availability: 0.9,
    note: "摩洛哥边路推进和 PSG 高压体系收益"
  },
  {
    name: "Lionel Messi",
    country: "Argentina",
    club: "Inter Miami",
    position: "Forward",
    form: 83,
    influence: 0.95,
    availability: 0.78,
    note: "经验和定位球价值仍高，体能权重下调"
  },
  {
    name: "Christian Pulisic",
    country: "United States",
    club: "AC Milan",
    position: "Forward",
    form: 84,
    influence: 0.82,
    availability: 0.88,
    note: "美国队主场周期最稳定的进攻球星"
  }
];

export function buildClubStarModel(events = CLUB_FORM_EVENTS, stars = STAR_FORM, links = CLUB_COUNTRY_LINKS) {
  const clubPower = calculateClubPower(events);
  const countryScores = new Map();

  for (const [club, power] of clubPower.entries()) {
    for (const link of links[club] ?? []) {
      addCountryScore(countryScores, link.country, {
        club: power.score * link.share,
        star: 0,
        stars: []
      });
    }
  }

  for (const star of stars) {
    const starImpact = calculateStarImpact(star);
    addCountryScore(countryScores, star.country, {
      club: 0,
      star: starImpact,
      stars: [{ ...star, impact: starImpact }]
    });
  }

  const nationalBoosts = [...countryScores.entries()]
    .map(([country, score]) => ({
      country,
      clubScore: round(score.club),
      starScore: round(score.star),
      totalScore: round(score.club + score.star),
      eloBoost: Math.round(clamp((score.club + score.star) * 0.42, 0, 55)),
      topStars: score.stars.sort((a, b) => b.impact - a.impact).slice(0, 3)
    }))
    .sort((a, b) => b.eloBoost - a.eloBoost || b.totalScore - a.totalScore);

  return {
    generatedAt: "2026-06-12",
    events,
    clubPower: [...clubPower.values()].sort((a, b) => b.score - a.score),
    stars: stars.map((star) => ({ ...star, impact: round(calculateStarImpact(star)) })).sort((a, b) => b.impact - a.impact),
    nationalBoosts
  };
}

export function getCountryBoost(model, country) {
  return model.nationalBoosts.find((entry) => entry.country === country)?.eloBoost ?? 0;
}

function calculateClubPower(events) {
  const clubs = new Map();
  for (const event of events) {
    addClub(clubs, event.winner, event, 24);
    addClub(clubs, event.runnerUp, event, 13);
  }
  return clubs;
}

function addClub(clubs, club, event, basePoints) {
  const current = clubs.get(club) ?? { club, score: 0, events: [] };
  const points = basePoints * event.importance * event.recency;
  current.score += points;
  current.events.push({
    label: event.label,
    role: event.winner === club ? "冠军" : "亚军",
    points: round(points)
  });
  current.score = round(current.score);
  clubs.set(club, current);
}

function calculateStarImpact(star) {
  const positionWeight = star.position === "Forward" ? 1 : star.position === "Midfielder" ? 0.94 : 0.86;
  return (star.form * star.influence * star.availability * positionWeight) / 10;
}

function addCountryScore(countryScores, country, addition) {
  const current = countryScores.get(country) ?? { club: 0, star: 0, stars: [] };
  current.club += addition.club;
  current.star += addition.star;
  current.stars.push(...addition.stars);
  countryScores.set(country, current);
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
