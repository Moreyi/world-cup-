import test from "node:test";
import assert from "node:assert/strict";

import {
  applyMatchResultsToElo,
  eloExpected,
  goalDifferenceMultiplier,
  simulateTournament
} from "../src/simulator.js";
import {
  fuseProbabilities,
  impliedMatchProbabilities,
  marketProbabilitiesForMatch
} from "../src/marketFusion.js";
import { STARTER_GROUPS } from "../src/data.js";

const SAMPLE_GROUPS = [
  {
    name: "A",
    teams: [
      { name: "Mexico", elo: 1881, host: true },
      { name: "South Africa", elo: 1511 },
      { name: "South Korea", elo: 1786 },
      { name: "Czechia", elo: 1712 }
    ]
  }
];

const SAMPLE_RESULTS = [
  {
    matchId: "A-1",
    teams: { teamA: "Mexico", teamB: "South Africa" },
    status: "final",
    score: { teamA: 2, teamB: 0 }
  },
  {
    matchId: "A-2",
    teams: { teamA: "South Korea", teamB: "Czechia" },
    status: "final",
    score: { teamA: 2, teamB: 1 }
  }
];

test("dynamic Elo updates", async (t) => {
  await t.test("uses the eloratings goal-difference multiplier", () => {
    assert.equal(goalDifferenceMultiplier(0), 1);
    assert.equal(goalDifferenceMultiplier(1), 1);
    assert.equal(goalDifferenceMultiplier(-1), 1);
    assert.equal(goalDifferenceMultiplier(2), 1.5);
    assert.equal(goalDifferenceMultiplier(3), 1.75);
    assert.equal(goalDifferenceMultiplier(-5), 2);
  });

  await t.test("applies K=60 winner gains without mutating input", () => {
    const { groups, adjustments } = applyMatchResultsToElo(SAMPLE_GROUPS, SAMPLE_RESULTS);
    const team = (name) => groups[0].teams.find((entry) => entry.name === name);

    const expectedMexicoDelta = Math.round(60 * 1.5 * (1 - eloExpected(1881, 1511)));
    const expectedKoreaDelta = Math.round(60 * 1 * (1 - eloExpected(1786, 1712)));

    assert.equal(team("Mexico").elo, 1881 + expectedMexicoDelta);
    assert.equal(team("South Africa").elo, 1511 - expectedMexicoDelta);
    assert.equal(team("South Korea").elo, 1786 + expectedKoreaDelta);
    assert.equal(team("Czechia").elo, 1712 - expectedKoreaDelta);
    assert.equal(adjustments.length, 2);
    assert.ok(adjustments.every((entry) => entry.delta > 0));

    assert.equal(SAMPLE_GROUPS[0].teams[0].elo, 1881, "input groups must stay untouched");
  });

  await t.test("ignores unfinished or unknown results", () => {
    const { groups, adjustments } = applyMatchResultsToElo(SAMPLE_GROUPS, [
      { matchId: "A-3", status: "scheduled", teams: { teamA: "Mexico", teamB: "South Korea" } },
      { matchId: "X-1", status: "final", teams: { teamA: "Nowhere", teamB: "Mexico" }, score: { teamA: 1, teamB: 0 } }
    ]);
    assert.equal(adjustments.length, 0);
    assert.equal(groups[0].teams[0].elo, 1881);
  });

  await t.test("simulateTournament applies updates unless disabled", () => {
    const withUpdates = simulateTournament(STARTER_GROUPS, {
      iterations: 10,
      seed: 7,
      matchResults: SAMPLE_RESULTS
    });
    const frozen = simulateTournament(STARTER_GROUPS, {
      iterations: 10,
      seed: 7,
      matchResults: SAMPLE_RESULTS,
      dynamicElo: false
    });
    const mexicoUpdated = withUpdates.find((entry) => entry.name === "Mexico");
    const mexicoFrozen = frozen.find((entry) => entry.name === "Mexico");
    assert.ok(mexicoUpdated.elo > 1881);
    assert.equal(mexicoFrozen.elo, 1881);
  });
});

test("market fusion", async (t) => {
  await t.test("normalizes the vig out of moneyline triples", () => {
    const implied = impliedMatchProbabilities({ teamA: -120, draw: 250, teamB: 380 });
    const total = implied.teamA + implied.draw + implied.teamB;
    assert.ok(Math.abs(total - 1) < 1e-9);
    assert.ok(implied.teamA > implied.draw && implied.draw > implied.teamB);
  });

  await t.test("blends model and market and renormalizes", () => {
    const model = { teamA: 0.31, draw: 0.258, teamB: 0.433 };
    const market = impliedMatchProbabilities({ teamA: 110, draw: 220, teamB: 290 });

    const pureModel = fuseProbabilities(model, market, 0);
    assert.ok(Math.abs(pureModel.teamA - 0.31 / (0.31 + 0.258 + 0.433)) < 1e-9);

    const pureMarket = fuseProbabilities(model, market, 1);
    assert.ok(Math.abs(pureMarket.teamA - market.teamA) < 1e-9);

    const blended = fuseProbabilities(model, market, 0.5);
    assert.ok(blended.fused);
    assert.ok(blended.teamA > model.teamA && blended.teamA < market.teamA + 1e-9);
    const total = blended.teamA + blended.draw + blended.teamB;
    assert.ok(Math.abs(total - 1) < 1e-9);
  });

  await t.test("returns the model unfused when no market data exists", () => {
    const model = { teamA: 0.5, draw: 0.3, teamB: 0.2 };
    const result = fuseProbabilities(model, null);
    assert.equal(result.fused, false);
    assert.equal(result.teamA, 0.5);
  });

  await t.test("looks up snapshot odds by matchId", () => {
    assert.ok(marketProbabilitiesForMatch("B-1").teamA > 0.4);
    assert.equal(marketProbabilitiesForMatch("Z-9"), null);
  });
});

test("fixture calendar and venue factors", async (t) => {
  const { FULL_MATCH_CALENDAR } = await import("../src/fixtureCalendar.js");
  const { venueEloBoost, venueAltitudeM } = await import("../src/venueFactors.js");
  const { buildGroupMatchAnalysis } = await import("../src/matchAnalysis.js");

  await t.test("covers all 72 group matches with dates and venues", () => {
    const ids = Object.keys(FULL_MATCH_CALENDAR);
    assert.equal(ids.length, 72);
    for (const id of ids) {
      const entry = FULL_MATCH_CALENDAR[id];
      assert.ok(entry.dateTime && entry.venue && entry.date, `${id} incomplete`);
    }
    assert.equal(FULL_MATCH_CALENDAR["A-1"].dateTime, "2026-06-11T19:00:00Z");
    assert.match(FULL_MATCH_CALENDAR["A-3"].venue, /Akron/);
  });

  await t.test("boosts acclimatized teams at altitude only", () => {
    assert.equal(venueAltitudeM("Estadio Banorte"), 2240);
    assert.equal(venueAltitudeM("Mexico City Stadium"), 2240);
    assert.equal(venueEloBoost("Mexico", "Estadio Banorte"), 40);
    assert.equal(venueEloBoost("Mexico", "Estadio Akron, Guadalajara"), 28);
    assert.equal(venueEloBoost("Czechia", "Estadio Banorte"), 0);
    assert.equal(venueEloBoost("Mexico", "SoFi Stadium"), 0);
    assert.equal(venueEloBoost("Ecuador", "Estadio Akron"), 28);
  });

  await t.test("every analysis row gets fixture info and altitude flows into probabilities", () => {
    const analysis = buildGroupMatchAnalysis(STARTER_GROUPS, { seed: 3 });
    assert.ok(analysis.matches.every((match) => match.fixture?.venue));
    const a3 = analysis.matches.find((match) => match.id === "A-3");
    assert.ok(a3.venueFactor && a3.venueFactor.teamA === 28, "Mexico at Akron should carry +28");
    const b1 = analysis.matches.find((match) => match.id === "B-1");
    assert.equal(b1.venueFactor, null);
  });
});
