import { test } from "node:test";
import assert from "node:assert/strict";

import {
  calculateTemperatureScore,
  calculateHumidityScore,
  calculateWindScore,
  calculateVisibilityScore,
  calculatePressureScore,
  calculateCloudinessScore,
  calculateComfortIndex,
} from "./comfort.service";

// ----- Sub-score functions -----

test("temperature score: peaks at the ideal 22C", () => {
  assert.equal(calculateTemperatureScore(22), 100);
});

test("temperature score: drops as it moves away from ideal", () => {
  assert.equal(calculateTemperatureScore(27), 85); // |27-22| * 3 = 15
  assert.equal(calculateTemperatureScore(12), 70); // |12-22| * 3 = 30
});

test("temperature score: clamped to 0, never negative", () => {
  assert.equal(calculateTemperatureScore(-20), 0);
  assert.equal(calculateTemperatureScore(80), 0);
});

test("humidity score: peaks at 50%", () => {
  assert.equal(calculateHumidityScore(50), 100);
  assert.equal(calculateHumidityScore(70), 70); // |70-50| * 1.5 = 30
});

test("wind score: peaks at a light 2 m/s breeze", () => {
  assert.equal(calculateWindScore(2), 100);
  assert.equal(calculateWindScore(7), 60); // |7-2| * 8 = 40
});

test("visibility score: linear up to 10km", () => {
  assert.equal(calculateVisibilityScore(10000), 100);
  assert.equal(calculateVisibilityScore(5000), 50);
  assert.equal(calculateVisibilityScore(0), 0);
});

test("visibility score: missing value assumes clear (100), no penalty", () => {
  assert.equal(calculateVisibilityScore(undefined), 100);
  assert.equal(calculateVisibilityScore(null), 100);
});

test("pressure score: peaks at 1013 hPa", () => {
  assert.equal(calculatePressureScore(1013), 100);
  assert.equal(calculatePressureScore(1003), 88); // |1003-1013| * 1.2 = 12
});

test("cloudiness score: clear sky best, overcast worst", () => {
  assert.equal(calculateCloudinessScore(0), 100);
  assert.equal(calculateCloudinessScore(100), 40); // 100 - 100*0.6
});

// ----- Full comfort index -----

const idealWeather = {
  main: { temp: 22, humidity: 50, pressure: 1013 },
  wind: { speed: 2 },
  clouds: { all: 0 },
  visibility: 10000,
};

test("comfort index: ideal conditions score 100", () => {
  assert.equal(calculateComfortIndex(idealWeather), 100);
});

test("comfort index: always within 0-100", () => {
  const harsh = {
    main: { temp: 45, humidity: 95, pressure: 970 },
    wind: { speed: 25 },
    clouds: { all: 100 },
    visibility: 200,
  };

  const score = calculateComfortIndex(harsh);

  assert.ok(score >= 0 && score <= 100, `score ${score} out of range`);
});

test("comfort index: more comfortable city ranks higher", () => {
  const pleasant = {
    main: { temp: 24, humidity: 55, pressure: 1012 },
    wind: { speed: 3 },
    clouds: { all: 20 },
    visibility: 10000,
  };

  const unpleasant = {
    main: { temp: 38, humidity: 88, pressure: 1000 },
    wind: { speed: 12 },
    clouds: { all: 90 },
    visibility: 3000,
  };

  assert.ok(
    calculateComfortIndex(pleasant) > calculateComfortIndex(unpleasant),
  );
});

test("comfort index: returns a number rounded to 2 decimals", () => {
  const score = calculateComfortIndex({
    main: { temp: 19.7, humidity: 61, pressure: 1009 },
    wind: { speed: 4.1 },
    clouds: { all: 40 },
    visibility: 8000,
  });

  assert.equal(typeof score, "number");
  assert.equal(Number(score.toFixed(2)), score);
});
