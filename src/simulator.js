export function createRng(seed = 1) {
  let state = Math.max(1, Math.floor(seed)) >>> 0;
  return function rng() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function eloExpected(eloA, eloB) {
  return 1 / (1 + 10 ** ((eloB - eloA) / 400));
}

export function matchProbabilities(teamA, teamB, options = {}) {
  const homeAdvantage = Number(options.homeAdvantage ?? 0);
  const drawBias = Number(options.drawBias ?? 0.28);
  const adjustedA = teamA.elo + (teamA.host ? homeAdvantage : 0);
  const adjustedB = teamB.elo + (teamB.host ? homeAdvantage : 0);
  const expectedA = eloExpected(adjustedA, adjustedB);
  const gap = Math.abs(adjustedA - adjustedB);
  const draw = clamp(drawBias * Math.exp(-gap / 700), 0.04, 0.34);
  const decisive = 1 - draw;

  return {
    teamA: decisive * expectedA,
    draw,
    teamB: decisive * (1 - expectedA),
    knockoutA: expectedA,
    knockoutB: 1 - expectedA
  };
}

export function simulateTournament(groups, options = {}) {
  const rng = createRng(options.seed ?? 1);
  const counts = new Map();
  const iterations = Math.max(1, Math.floor(options.iterations ?? 1000));

  for (const group of groups) {
    for (const team of group.teams) {
      counts.set(team.name, {
        name: team.name,
        group: group.name,
        elo: team.elo,
        wins: 0,
        finals: 0,
        semifinals: 0,
        quarterfinals: 0,
        roundOf16: 0,
        roundOf32: 0
      });
    }
  }

  for (let i = 0; i < iterations; i += 1) {
    const qualifiers = simulateGroupStage(groups, options, rng);
    for (const team of qualifiers) counts.get(team.name).roundOf32 += 1;

    let field = seedKnockout(qualifiers);
    field = playRound(field, options, rng);
    for (const team of field) counts.get(team.name).roundOf16 += 1;

    field = playRound(field, options, rng);
    for (const team of field) counts.get(team.name).quarterfinals += 1;

    field = playRound(field, options, rng);
    for (const team of field) counts.get(team.name).semifinals += 1;

    field = playRound(field, options, rng);
    for (const team of field) counts.get(team.name).finals += 1;

    const champion = playKnockoutMatch(field[0], field[1], options, rng);
    counts.get(champion.name).wins += 1;
  }

  return [...counts.values()]
    .map((entry) => ({
      ...entry,
      winProbability: entry.wins / iterations,
      finalProbability: entry.finals / iterations,
      semifinalProbability: entry.semifinals / iterations,
      quarterfinalProbability: entry.quarterfinals / iterations,
      roundOf16Probability: entry.roundOf16 / iterations,
      roundOf32Probability: entry.roundOf32 / iterations
    }))
    .sort((a, b) => b.winProbability - a.winProbability || b.elo - a.elo);
}

export function simulateGroupStage(groups, options, rng) {
  const first = [];
  const second = [];
  const third = [];

  for (const group of groups) {
    const table = group.teams.map((team) => ({
      ...team,
      group: group.name,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      tieBreak: rng()
    }));

    for (let i = 0; i < table.length; i += 1) {
      for (let j = i + 1; j < table.length; j += 1) {
        playGroupMatch(table[i], table[j], options, rng);
      }
    }

    table.sort(compareTableRows);
    first.push(table[0]);
    second.push(table[1]);
    third.push(table[2]);
  }

  third.sort(compareThirdPlaceRows);
  return [...first, ...second, ...third.slice(0, 8)];
}

function playGroupMatch(teamA, teamB, options, rng) {
  const probabilities = matchProbabilities(teamA, teamB, options);
  const drawRoll = rng();
  const goalModel = sampleScore(teamA, teamB, probabilities, rng);
  let goalsA = goalModel.goalsA;
  let goalsB = goalModel.goalsB;

  if (drawRoll < probabilities.draw) {
    const shared = Math.min(goalsA, goalsB);
    goalsA = shared;
    goalsB = shared;
  } else if (drawRoll < probabilities.draw + probabilities.teamA) {
    if (goalsA <= goalsB) goalsA = goalsB + 1;
  } else if (goalsB <= goalsA) {
    goalsB = goalsA + 1;
  }

  teamA.goalsFor += goalsA;
  teamA.goalsAgainst += goalsB;
  teamB.goalsFor += goalsB;
  teamB.goalsAgainst += goalsA;

  if (goalsA > goalsB) {
    teamA.points += 3;
  } else if (goalsB > goalsA) {
    teamB.points += 3;
  } else {
    teamA.points += 1;
    teamB.points += 1;
  }
}

function sampleScore(teamA, teamB, probabilities, rng) {
  const attackA = 0.75 + probabilities.knockoutA * 1.7;
  const attackB = 0.75 + probabilities.knockoutB * 1.7;
  return {
    goalsA: poisson(attackA, rng),
    goalsB: poisson(attackB, rng)
  };
}

function poisson(lambda, rng) {
  const limit = Math.exp(-lambda);
  let product = 1;
  let count = 0;

  do {
    count += 1;
    product *= rng();
  } while (product > limit);

  return count - 1;
}

function seedKnockout(teams) {
  return [...teams].sort((a, b) => b.elo - a.elo || a.group.localeCompare(b.group));
}

function playRound(field, options, rng) {
  const winners = [];
  for (let i = 0; i < field.length / 2; i += 1) {
    const left = field[i];
    const right = field[field.length - 1 - i];
    winners.push(playKnockoutMatch(left, right, options, rng));
  }
  return seedKnockout(winners);
}

function playKnockoutMatch(teamA, teamB, options, rng) {
  const probabilities = matchProbabilities(teamA, teamB, options);
  return rng() < probabilities.knockoutA ? teamA : teamB;
}

function compareTableRows(a, b) {
  return (
    b.points - a.points ||
    goalDifference(b) - goalDifference(a) ||
    b.goalsFor - a.goalsFor ||
    b.elo - a.elo ||
    b.tieBreak - a.tieBreak
  );
}

function compareThirdPlaceRows(a, b) {
  return compareTableRows(a, b);
}

function goalDifference(team) {
  return team.goalsFor - team.goalsAgainst;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
