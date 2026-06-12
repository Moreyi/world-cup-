import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildClubStarModel, getCountryBoost } from "../src/clubModel.js";
import { STARTER_GROUPS } from "../src/data.js";
import { WORLD_CUP_2026_CONTEXT, WORLD_CUP_HISTORY, summarizeHistory } from "../src/history.js";
import { clubName, countryName, localizeCountryText, positionName } from "../src/localization.js";
import { buildGroupMatchAnalysis } from "../src/matchAnalysis.js";
import { NATIONAL_STAR_PROFILES, summarizeNationalStars } from "../src/nationalStars.js";
import {
  americanToImpliedProbability,
  buildPolicyOddsModel,
  getOddsBoost,
  getPolicyBoost
} from "../src/policyOddsModel.js";
import { eloExpected, matchProbabilities, simulateGroupStage, simulateTournament } from "../src/simulator.js";
import { TREND_SCENARIOS, buildForecastTrend } from "../src/trendAnalysis.js";
import { fetchRealtimeFixtures } from "../src/realtimeData.js";
import { recentFormForCountry } from "../src/recentForm.js";
import { coachForCountry } from "../src/teamStaff.js";

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

  it("applies completed group results before simulating remaining matches", () => {
    const base = simulateTournament(STARTER_GROUPS, { iterations: 600, seed: 7 });
    const adjusted = simulateTournament(STARTER_GROUPS, {
      iterations: 600,
      seed: 7,
      matchResults: [{ matchId: "A-1", status: "final", score: { teamA: 9, teamB: 0 } }]
    });
    const baseMexico = base.find((team) => team.name === "Mexico");
    const adjustedMexico = adjusted.find((team) => team.name === "Mexico");

    assert.ok(adjustedMexico.roundOf32Probability > baseMexico.roundOf32Probability);
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

describe("policy and odds model", () => {
  it("converts American odds to implied probability", () => {
    assert.ok(Math.abs(americanToImpliedProbability(450) - 0.1818181818) < 1e-10);
    assert.ok(Math.abs(americanToImpliedProbability(-150) - 0.6) < 1e-10);
  });

  it("builds policy and odds boosts", () => {
    const model = buildPolicyOddsModel();
    assert.ok(getPolicyBoost(model, "United States") > 0);
    assert.ok(getPolicyBoost(model, "Australia") < 0);
    assert.ok(getOddsBoost(model, "France") > 0);
    assert.equal(getOddsBoost(model, "Atlantis"), 0);
  });
});

describe("match-by-match analysis", () => {
  it("builds one chart row for every group-stage match", () => {
    const analysis = buildGroupMatchAnalysis(STARTER_GROUPS);
    assert.equal(analysis.matches.length, 72);
    assert.equal(analysis.summary.totalMatches, 72);
  });

  it("marks completed matches with scores and post-match analysis", () => {
    const analysis = buildGroupMatchAnalysis(STARTER_GROUPS);
    const opener = analysis.matches.find((match) => match.id === "A-1");

    assert.equal(analysis.summary.completedMatches, 2);
    assert.equal(analysis.summary.totalGoals, 5);
    assert.equal(opener.result.status, "final");
    assert.deepEqual(opener.result.score, { teamA: 2, teamB: 0 });
    assert.equal(opener.postMatch.points.teamA, 3);
    assert.ok(opener.postMatch.forecastProbability > 0);
  });

  it("surfaces today's matches as a separate feed", () => {
    const analysis = buildGroupMatchAnalysis(STARTER_GROUPS);
    assert.equal(analysis.todayDate, "2026-06-12");
    assert.deepEqual(
      analysis.todayMatches.map((match) => match.id),
      ["B-1", "D-1"]
    );
    assert.equal(analysis.todayMatches[0].teamA.name, "Canada");
    assert.equal(analysis.todayMatches[1].teamA.name, "United States");
    assert.ok(analysis.todayMatches[0].predictedScore.label.includes("-"));
    assert.ok(analysis.todayMatches[0].tacticalPreview.duel);
    assert.ok(analysis.todayMatches[1].tacticalPreview.prediction);
  });

  it("keeps each match outcome distribution normalized", () => {
    const analysis = buildGroupMatchAnalysis(STARTER_GROUPS);
    for (const match of analysis.matches) {
      const total = match.probabilities.teamA + match.probabilities.draw + match.probabilities.teamB;
      assert.ok(Math.abs(total - 1) < 1e-12);
      assert.ok(Number.isInteger(match.predictedScore.teamA));
      assert.ok(Number.isInteger(match.predictedScore.teamB));
    }
  });
});

describe("forecast trend analysis", () => {
  it("compares model stages and ranks trend leaders", () => {
    const scenarioResults = {
      base: [
        { name: "France", group: "I", elo: 2030, winProbability: 0.12 },
        { name: "Argentina", group: "J", elo: 2055, winProbability: 0.16 }
      ],
      form: [
        { name: "France", group: "I", elo: 2060, winProbability: 0.15 },
        { name: "Argentina", group: "J", elo: 2070, winProbability: 0.15 }
      ],
      policy: [
        { name: "France", group: "I", elo: 2068, winProbability: 0.17 },
        { name: "Argentina", group: "J", elo: 2075, winProbability: 0.14 }
      ],
      full: [
        { name: "France", group: "I", elo: 2090, winProbability: 0.2 },
        { name: "Argentina", group: "J", elo: 2080, winProbability: 0.13 }
      ]
    };
    const trend = buildForecastTrend(scenarioResults, TREND_SCENARIOS);
    assert.equal(trend.summary.leader.name, "France");
    assert.equal(trend.summary.biggestRiser.name, "France");
    assert.equal(trend.summary.biggestFaller.name, "Argentina");
    assert.equal(trend.rows.length, 2);
  });
});

describe("national star profiles", () => {
  it("loads major national-team star pools", () => {
    const summary = summarizeNationalStars(NATIONAL_STAR_PROFILES);
    assert.ok(summary.totalCountries >= 18);
    assert.ok(summary.totalStars >= 72);
    assert.equal(summary.profiles[0].stars.length, 4);
    assert.ok(summary.topProfile.starIndex > 80);
  });

  it("keeps every star impact score in a displayable range", () => {
    for (const profile of NATIONAL_STAR_PROFILES) {
      assert.equal(profile.stars.length, 4);
      for (const star of profile.stars) {
        assert.ok(star.impactScore >= 70);
        assert.ok(star.impactScore <= 100);
        assert.ok(star.shortName);
        assert.ok(star.chineseName);
      }
    }
  });
});

describe("realtime fixtures", () => {
  it("normalizes ESPN scoreboard matches and market odds", async () => {
    const fixture = await fetchRealtimeFixtures({
      date: "2026-06-12",
      fetcher: async () => ({
        ok: true,
        async json() {
          return {
            events: [
              {
                id: "760416",
                date: "2026-06-12T19:00Z",
                competitions: [
                  {
                    date: "2026-06-12T19:00Z",
                    status: { type: { state: "pre", completed: false, detail: "Fri, June 12th at 3:00 PM EDT" } },
                    venue: { fullName: "BMO Field", address: { city: "Toronto", country: "Canada" } },
                    competitors: [
                      { homeAway: "home", score: "0", team: { displayName: "Canada" } },
                      { homeAway: "away", score: "0", team: { displayName: "Bosnia-Herzegovina" } }
                    ],
                    odds: [
                      {
                        provider: { displayName: "DraftKings" },
                        moneyline: {
                          home: { close: { odds: "-120" } },
                          draw: { close: { odds: "+250" } },
                          away: { close: { odds: "+380" } }
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          };
        }
      })
    });

    assert.equal(fixture.updates[0].homeTeam, "Canada");
    assert.equal(fixture.updates[0].awayTeam, "Bosnia and Herzegovina");
    assert.equal(fixture.updates[0].marketOdds.provider, "DraftKings");
    assert.ok(fixture.updates[0].marketOdds.implied.home > fixture.updates[0].marketOdds.implied.away);
  });
});

describe("team staff", () => {
  it("provides coach display data for starter countries", () => {
    assert.equal(coachForCountry("Canada").name, "Jesse Marsch");
    assert.ok(coachForCountry("France").chineseName);
  });
});

describe("recent form", () => {
  it("keeps same-day teams connected to recent match notes", () => {
    assert.ok(recentFormForCountry("Canada").matches.length >= 3);
    assert.ok(recentFormForCountry("United States").summary.includes("2026"));
    assert.equal(recentFormForCountry("Atlantis").matches.length, 0);
  });
});

describe("Chinese localization", () => {
  it("localizes countries, clubs, positions, and score text", () => {
    assert.equal(countryName("Brazil"), "巴西");
    assert.equal(clubName("Paris Saint-Germain"), "巴黎圣日耳曼");
    assert.equal(positionName("Forward"), "前锋");
    assert.equal(localizeCountryText("Brazil 2-0 Germany"), "巴西 2-0 德国");
  });
});
