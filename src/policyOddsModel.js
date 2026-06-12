export const POLICY_FACTORS = [
  {
    id: "co-host",
    label: "2026 东道主与组织适应",
    type: "policy",
    rationale: "2026 由加拿大、墨西哥、美国联合举办，东道主在基地、球迷、气候和行政准备上通常更早进入赛会节奏。",
    impacts: [
      { country: "United States", boost: 18 },
      { country: "Mexico", boost: 18 },
      { country: "Canada", boost: 16 }
    ]
  },
  {
    id: "regional-familiarity",
    label: "美洲时区与旅行适应",
    type: "logistics",
    rationale: "美洲球队更熟悉跨北美旅行、时区和部分比赛环境；这不是实力加成，只是赛会适应修正。",
    impacts: [
      { country: "Argentina", boost: 5 },
      { country: "Brazil", boost: 5 },
      { country: "Colombia", boost: 5 },
      { country: "Ecuador", boost: 5 },
      { country: "Paraguay", boost: 4 },
      { country: "Uruguay", boost: 4 },
      { country: "Panama", boost: 6 },
      { country: "Jamaica", boost: 5 }
    ]
  },
  {
    id: "expanded-format-depth",
    label: "48 队赛制与阵容深度",
    type: "format",
    rationale: "扩军和更长赛程提升阵容深度、轮换质量、医疗恢复和替补冲击力的重要性。",
    impacts: [
      { country: "France", boost: 8 },
      { country: "England", boost: 8 },
      { country: "Spain", boost: 7 },
      { country: "Brazil", boost: 7 },
      { country: "Germany", boost: 6 },
      { country: "Portugal", boost: 6 },
      { country: "Argentina", boost: 5 },
      { country: "Netherlands", boost: 5 },
      { country: "Belgium", boost: 4 },
      { country: "Croatia", boost: 4 }
    ]
  },
  {
    id: "long-haul-adaptation",
    label: "长途旅行和基地切换风险",
    type: "logistics",
    rationale: "跨洲长距离旅行和基地切换会增加恢复管理难度；负值代表准备成本，不代表球队弱。",
    impacts: [
      { country: "Australia", boost: -5 },
      { country: "New Zealand", boost: -5 },
      { country: "Japan", boost: -4 },
      { country: "South Korea", boost: -4 },
      { country: "Iran", boost: -4 },
      { country: "Saudi Arabia", boost: -4 },
      { country: "Iraq", boost: -4 },
      { country: "Jordan", boost: -4 },
      { country: "Qatar", boost: -3 },
      { country: "Uzbekistan", boost: -3 }
    ]
  },
  {
    id: "administrative-uncertainty",
    label: "签证与行政不确定性",
    type: "risk",
    rationale: "外部行政摩擦可能影响备战节奏。这里使用小幅风险修正，避免把非竞技因素过度放大。",
    impacts: [
      { country: "Iran", boost: -5 },
      { country: "Iraq", boost: -3 },
      { country: "Jordan", boost: -2 }
    ]
  }
];

export const ODDS_SNAPSHOT = {
  generatedAt: "2026-06-12",
  format: "american",
  note: "赔率为示例市场快照，用于模型校准演示；不同机构、地区和时间会变化。不是投注建议。",
  entries: [
    { country: "France", american: 450 },
    { country: "Spain", american: 450 },
    { country: "England", american: 700 },
    { country: "Portugal", american: 850 },
    { country: "Brazil", american: 900 },
    { country: "Argentina", american: 950 },
    { country: "Germany", american: 1400 },
    { country: "Netherlands", american: 1600 },
    { country: "United States", american: 5500 },
    { country: "Mexico", american: 6500 },
    { country: "Canada", american: 25000 }
  ]
};

export function buildPolicyOddsModel(policyFactors = POLICY_FACTORS, oddsSnapshot = ODDS_SNAPSHOT) {
  const policyScores = calculatePolicyScores(policyFactors);
  const oddsRows = calculateOddsRows(oddsSnapshot.entries);

  return {
    generatedAt: oddsSnapshot.generatedAt,
    note: oddsSnapshot.note,
    policyFactors,
    policyScores,
    oddsRows,
    combinedRows: combineRows(policyScores, oddsRows)
  };
}

export function getPolicyBoost(model, country) {
  return model.policyScores.find((entry) => entry.country === country)?.policyBoost ?? 0;
}

export function getOddsBoost(model, country) {
  return model.oddsRows.find((entry) => entry.country === country)?.oddsBoost ?? 0;
}

export function americanToImpliedProbability(american) {
  if (american > 0) return 100 / (american + 100);
  return Math.abs(american) / (Math.abs(american) + 100);
}

function calculatePolicyScores(policyFactors) {
  const countries = new Map();
  for (const factor of policyFactors) {
    for (const impact of factor.impacts) {
      const current = countries.get(impact.country) ?? { country: impact.country, rawBoost: 0, factors: [] };
      current.rawBoost += impact.boost;
      current.factors.push({
        label: factor.label,
        type: factor.type,
        boost: impact.boost
      });
      countries.set(impact.country, current);
    }
  }

  return [...countries.values()]
    .map((entry) => ({
      ...entry,
      policyBoost: clamp(Math.round(entry.rawBoost), -14, 30)
    }))
    .sort((a, b) => b.policyBoost - a.policyBoost || a.country.localeCompare(b.country));
}

function calculateOddsRows(entries) {
  const impliedTotal = entries.reduce((sum, entry) => sum + americanToImpliedProbability(entry.american), 0);
  const meanProbability = impliedTotal / entries.length;

  return entries
    .map((entry) => {
      const impliedProbability = americanToImpliedProbability(entry.american);
      const normalizedProbability = impliedProbability / impliedTotal;
      return {
        ...entry,
        impliedProbability,
        normalizedProbability,
        oddsBoost: clamp(Math.round((impliedProbability - meanProbability) * 240), -8, 28)
      };
    })
    .sort((a, b) => b.impliedProbability - a.impliedProbability || a.country.localeCompare(b.country));
}

function combineRows(policyScores, oddsRows) {
  const countries = new Map();
  for (const entry of policyScores) {
    countries.set(entry.country, {
      country: entry.country,
      policyBoost: entry.policyBoost,
      oddsBoost: 0
    });
  }
  for (const entry of oddsRows) {
    const current = countries.get(entry.country) ?? {
      country: entry.country,
      policyBoost: 0,
      oddsBoost: 0
    };
    current.oddsBoost = entry.oddsBoost;
    current.impliedProbability = entry.impliedProbability;
    current.normalizedProbability = entry.normalizedProbability;
    countries.set(entry.country, current);
  }

  return [...countries.values()]
    .map((entry) => ({
      ...entry,
      totalExternalBoost: entry.policyBoost + entry.oddsBoost
    }))
    .sort((a, b) => b.totalExternalBoost - a.totalExternalBoost || a.country.localeCompare(b.country));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
