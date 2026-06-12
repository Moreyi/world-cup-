import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildClubStarModel, getCountryBoost } from "../src/clubModel.js";
import { STARTER_GROUPS } from "../src/data.js";
import { WORLD_CUP_2026_CONTEXT, WORLD_CUP_HISTORY, summarizeHistory } from "../src/history.js";
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

describe("world cup history summary", () => {
  it("summarizes completed tournaments from 2002 through 2022", () => {
    const summary = summarizeHistory(WORLD_CUP_HISTORY);
    assert.equal(summary.editions, 6);
    assert.equal(summary.totalGoals, 965);
    assert.equal(summary.totalMatches, 384);
    assert.equal(summary.highestScoring.year, 2022);
    assert.equal(summary.lowestScoring.year, 2010);
    assert.equal(summary.confederationTitles.UEFA, 4);
    assert.equal(summary.confederationTitles.CONMEBOL, 2);
  });

  it("keeps 2026 separate because it is not complete", () => {
    assert.equal(WORLD_CUP_2026_CONTEXT.teams, 48);
    assert.equal(WORLD_CUP_2026_CONTEXT.matches, 104);
    assert.equal(WORLD_CUP_2026_CONTEXT.status, "进行中");
  });
});

describe("club and star model", () => {
  it("builds national Elo boosts from club events and star form", () => {
    const model = buildClubStarModel();
    assert.ok(model.events.length >= 6);
    assert.ok(model.clubPower[0].score > 0);
    assert.ok(model.stars[0].impact > 0);
    assert.ok(getCountryBoost(model, "France") > 0);
    assert.ok(getCountryBoost(model, "England") > 0);
  });

  it("returns zero boost for countries outside the model sample", () => {
    const model = buildClubStarModel();
    assert.equal(getCountryBoost(model, "Atlantis"), 0);
  });
});
