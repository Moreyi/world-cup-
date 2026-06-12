export const TREND_SCENARIOS = [
  {
    id: "base",
    label: "纯 Elo",
    options: { useFormModel: false, usePolicyModel: false, useOddsModel: false }
  },
  {
    id: "form",
    label: "状态",
    options: { useFormModel: true, usePolicyModel: false, useOddsModel: false }
  },
  {
    id: "policy",
    label: "状态+政策",
    options: { useFormModel: true, usePolicyModel: true, useOddsModel: false }
  },
  {
    id: "full",
    label: "全模型",
    options: { useFormModel: true, usePolicyModel: true, useOddsModel: true }
  }
];

export function buildForecastTrend(scenarioResults, scenarios = TREND_SCENARIOS) {
  const teams = new Map();

  for (const scenario of scenarios) {
    for (const result of scenarioResults[scenario.id] ?? []) {
      const row = teams.get(result.name) ?? {
        name: result.name,
        group: result.group,
        elo: result.elo,
        probabilities: {}
      };
      row.probabilities[scenario.id] = result.winProbability;
      teams.set(result.name, row);
    }
  }

  const rows = [...teams.values()].map((row) => {
    const values = scenarios.map((scenario) => row.probabilities[scenario.id] ?? 0);
    const first = values[0] ?? 0;
    const last = values[values.length - 1] ?? 0;
    return {
      ...row,
      values,
      startProbability: first,
      finalProbability: last,
      delta: last - first,
      volatility: Math.max(...values) - Math.min(...values),
      direction: classifyDirection(last - first)
    };
  });

  rows.sort((a, b) => b.finalProbability - a.finalProbability || b.delta - a.delta);

  const risers = [...rows].sort((a, b) => b.delta - a.delta).slice(0, 5);
  const fallers = [...rows].sort((a, b) => a.delta - b.delta).slice(0, 5);
  const volatile = [...rows].sort((a, b) => b.volatility - a.volatility).slice(0, 5);

  return {
    scenarios,
    rows,
    leaders: rows.slice(0, 10),
    risers,
    fallers,
    volatile,
    summary: {
      leader: rows[0],
      biggestRiser: risers[0],
      biggestFaller: fallers[0],
      mostVolatile: volatile[0]
    }
  };
}

function classifyDirection(delta) {
  if (delta > 0.015) return "上升";
  if (delta < -0.015) return "回落";
  return "稳定";
}
