import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { STARTER_GROUPS } from "../src/data.js";
import { eloExpected, matchProbabilities, simulateGroupStage, simulateTournament } from "../src/simulator.js";

describe("eloExpected", () => {
  it("returns 50% for equal ratings", () => {
    assert.equal(eloExpected(1800, 1800), 0.5);
  });

  it("rewards higher-rated teams", () => {
    assert.ok(eloExpected(2000, 1800) > 0.75);
    assert.ok(eloExpected(1600, 1800) < 0.25);
  });
});

describe("matchProbabilities", () => {
  it("sums group-stage outcomes to one", () => {
    const probabilities = matchProbabilities({ name: "A", elo: 1800 }, { name: "B", elo: 1700 });
    const total = probabilities.teamA + probabilities.draw + probabilities.teamB;
    assert.ok(Math.abs(total - 1) < 1e-12);
  });

  it("applies host advantage", () => {
    const neutral = matchProbabilities({ name: "A", elo: 1800 }, { name: "B", elo: 1800 }, { homeAdvantage: 40 });
    const hosted = matchProbabilities({ name: "A", elo: 1800, host: true }, { name: "B", elo: 1800 }, { homeAdvantage: 40 });
    assert.ok(hosted.knockoutA > neutral.knockoutA);
  });
});

describe("simulateGroupStage", () => {
  it("returns 32 qualifiers from 12 groups", () => {
    const qualifiers = simulateGroupStage(STARTER_GROUPS, { seed: 42 }, () => 0.42);
    assert.equal(qualifiers.length, 32);
  });
});

describe("simulateTournament", () => {
  it("produces one champion per iteration", () => {
    const results = simulateTournament(STARTER_GROUPS, { iterations: 200, seed: 99 });
    const totalWins = results.reduce((sum, team) => sum + team.wins, 0);
    assert.equal(totalWins, 200);
    assert.equal(results.length, 48);
  });
});
