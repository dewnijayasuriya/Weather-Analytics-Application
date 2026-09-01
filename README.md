# Weather Analytics Application

A secure weather analytics dashboard. It reads a list of cities, fetches live
weather from OpenWeatherMap, computes a custom **Comfort Index** for each city
on the server, ranks the cities from most to least comfortable, and presents the
result in a responsive UI behind Auth0 authentication.

- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Auth:** Auth0 (Authorization Code + PKCE on the SPA, RS256 JWT validation on the API)
- **Caching:** in-memory, server-side, 5-minute TTL

---

## Table of contents

1. [Project structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Setup instructions](#setup-instructions)
4. [Environment variables](#environment-variables)
5. [Running the app](#running-the-app)
6. [Auth0 configuration](#auth0-configuration)
7. [API endpoints](#api-endpoints)
8. [Comfort Index formula](#comfort-index-formula)
9. [Reasoning behind the variable weights](#reasoning-behind-the-variable-weights)
10. [Trade-offs considered](#trade-offs-considered)
11. [Cache design](#cache-design)
12. [Testing](#testing)
13. [Bonus features implemented](#bonus-features-implemented)
14. [Known limitations](#known-limitations)

---

## Project structure

```
Weather-Analytics-Application/
├── backend/
│   ├── src/
│   │   ├── app.ts                     # Express bootstrap
│   │   ├── config/env.ts              # loads + validates env vars once
│   │   ├── cache/weather.cache.ts     # in-memory cache (raw + processed) + HIT/MISS stats
│   │   ├── data/cities.json           # city list (CityCode + CityName)
│   │   ├── middleware/auth.middleware.ts  # Auth0 RS256 JWT validation
│   │   ├── routes/
│   │   │   ├── weather.routes.ts      # GET /api/weather  (protected)
│   │   │   └── cache.routes.ts        # GET /api/cache, POST /api/cache/clear
│   │   └── services/
│   │       ├── city.service.ts        # reads cities.json
│   │       ├── weather.service.ts     # fetches OpenWeatherMap, uses cache
│   │       ├── comfort.service.ts     # the Comfort Index (computed here, server-side)
│   │       └── comfort.service.test.ts
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── main.tsx                   # Auth0Provider
    │   ├── App.tsx                    # loading / error / login / dashboard routing
    │   ├── api/weather.ts             # typed fetch of /api/weather with Bearer token
    │   ├── hooks/useTheme.ts          # dark-mode toggle, persisted
    │   ├── lib/comfort.ts             # display-only label/colour helpers (no scoring)
    │   └── components/                # Dashboard, Hero, CityCard, CityModal, Chips, etc.
    └── .env.example
```

---

## Prerequisites

- **Node.js 20+** (backend tests use the built-in `node:test` runner)
- An **OpenWeatherMap API key** — register free at <https://openweathermap.org/api>
- An **Auth0 tenant** (free) with one SPA application and one API

---

## Setup instructions

```bash
# 1. Clone
git clone <repo-url>
cd Weather-Analytics-Application

# 2. Backend
cd backend
npm install
cp .env.example .env        # then fill in the values (see below)

# 3. Frontend
cd ../frontend
npm install
cp .env.example .env        # then fill in the values (see below)
```

---

## Environment variables

### `backend/.env`

| Variable              | Description                                                        |
| --------------------- | ---------------------------------------------------------------- |
| `PORT`                | API port (default `5000`)                                        |
| `OPENWEATHER_API_KEY` | Your OpenWeatherMap API key                                      |
| `AUTH0_DOMAIN`        | Auth0 tenant domain, e.g. `dev-xxxx.us.auth0.com` (no `https://`) |
| `AUTH0_AUDIENCE`      | Auth0 API Identifier, e.g. `https://weather-analytics-api`        |

### `frontend/.env`

| Variable               | Description                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `VITE_AUTH0_DOMAIN`    | Same tenant domain as the backend                                 |
| `VITE_AUTH0_CLIENT_ID` | Client ID of the Auth0 **SPA** application                        |
| `VITE_AUTH0_AUDIENCE`  | Same value as `AUTH0_AUDIENCE` in the backend                     |
| `VITE_API_BASE_URL`    | Backend base URL (optional, defaults to `http://localhost:5000`)  |

`.env` files are git-ignored. Only `.env.example` is committed.

---

## Running the app

Open two terminals.

```bash
# Terminal 1 - backend  (http://localhost:5000)
cd backend
npm run dev

# Terminal 2 - frontend  (http://localhost:5173)
cd frontend
npm run dev
```

Then open <http://localhost:5173>, click **Sign in**, and log in with the test user:

```
Email:    careers@fidenz.com
Password: Pass#fidenz
```

### Production build

```bash
# backend
cd backend && npm run build && npm start

# frontend
cd frontend && npm run build && npm run preview
```

---

## Auth0 configuration

The assignment requires authentication, MFA via email, and no public signups.
These are configured in the Auth0 dashboard (not in code):

1. **Application (SPA)**
   - Type: *Single Page Application*
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Logout URLs: `http://localhost:5173`
   - Allowed Web Origins: `http://localhost:5173`

2. **API**
   - Create an API with identifier `https://weather-analytics-api`
     (this is the `audience`; it must match both `.env` files).

3. **Multi-Factor Authentication**
   - Enable MFA and turn on the **Email** factor.
   - Set the policy so MFA is required on every login.

4. **Restrict signups**
   - On the Username-Password database connection, disable **Sign Ups**.
   - Add only whitelisted users (including the test user above).
   - A Post-Login **Action** denies any login whose email is not on the
     whitelist; the frontend reads the `?error=/error_description=` query
     parameters Auth0 returns and shows an "Access denied" screen.

### How auth is enforced

- The SPA obtains an access token via `getAccessTokenSilently()` and sends it as
  `Authorization: Bearer <token>` on every call to `/api/weather`.
- The backend middleware (`express-oauth2-jwt-bearer`) validates the token's
  signature (RS256, keys fetched from the tenant JWKS), `issuer`, `audience`,
  and expiry. Any request without a valid token gets **401**.
- The dashboard route is unreachable in the UI until `isAuthenticated` is true.

---

## API endpoints

| Method | Path                | Auth | Description                                                    |
| ------ | ------------------- | ---- | ------------------------------------------------------------- |
| GET    | `/`                 | no   | Health check                                                  |
| GET    | `/api/weather`      | yes  | Ranked city list with weather + comfort score + rank + `cache: HIT\|MISS` |
| GET    | `/api/cache`        | no   | Debug: cache TTL, per-city freshness, and running HIT/MISS counters |
| POST   | `/api/cache/clear`  | no   | Testing helper — wipes the cache so the next request is a guaranteed MISS |

### Sample `/api/weather` response

```json
{
  "count": 10,
  "generatedAt": "2026-09-01T09:00:00.000Z",
  "cache": "MISS",
  "cities": [
    {
      "rank": 1,
      "CityCode": "2988507",
      "CityName": "Paris",
      "temperature": 22.4,
      "humidity": 55,
      "windSpeed": 2.1,
      "visibility": 10000,
      "pressure": 1013,
      "cloudiness": 20,
      "weather": "Clear",
      "description": "clear sky",
      "comfortIndex": 88.7
    }
  ]
}
```

---

## Comfort Index formula

The Comfort Index is a single number from **0 (least comfortable)** to
**100 (most comfortable)**. It is computed **entirely on the backend** in
`backend/src/services/comfort.service.ts`. The frontend only displays and
sorts by the value it receives.

### Step 1 — six sub-scores, each 0–100

Each weather parameter is first converted to its own 0–100 "comfort" score.
Every sub-score is clamped to `[0, 100]`.

| Parameter    | Ideal value | Sub-score rule                                    |
| ------------ | ----------- | ------------------------------------------------- |
| Temperature  | 22 °C       | `100 − |temp − 22| × 3`                           |
| Humidity     | 50 %        | `100 − |humidity − 50| × 1.5`                     |
| Wind speed   | 2 m/s       | `100 − |wind − 2| × 8`                            |
| Visibility   | 10 000 m    | `(visibility / 10000) × 100` (missing ⇒ 100)     |
| Pressure     | 1013 hPa    | `100 − |pressure − 1013| × 1.2`                   |
| Cloudiness   | 0 %         | `100 − cloudiness × 0.6`                          |

### Step 2 — weighted average

```
ComfortIndex =
    temperatureScore × 0.30
  + humidityScore    × 0.20
  + windScore        × 0.15
  + visibilityScore  × 0.15
  + pressureScore    × 0.10
  + cloudinessScore  × 0.10
```

Weights sum to **1.0**, so the result is already in `[0, 100]`. It is rounded to
2 decimal places.

### Step 3 — ranking

Cities are sorted by `comfortIndex` descending. `rank` is the 1-based position,
so rank 1 is the most comfortable city.

---

## Reasoning behind the variable weights

The index is meant to model **how pleasant it feels to a person to be outside**,
so parameters that dominate perceived comfort get the most weight.

- **Temperature — 0.30 (highest).**
  Temperature is the single biggest driver of thermal comfort. 22 °C is a widely
  used neutral "room temperature". The penalty of 3 points per °C means a city
  ~17 °C away from ideal (e.g. 5 °C or 39 °C) scores near zero on this axis,
  which matches how quickly comfort drops once you're far from ideal.

- **Humidity — 0.20 (second).**
  High humidity blocks sweat evaporation and makes heat feel worse; very low
  humidity dries skin and eyes. 50 % is the middle of the commonly cited
  40–60 % comfort band. It's weighted below temperature because its effect is
  strongly *conditional* on temperature.

- **Wind speed — 0.15.**
  A light breeze (~2 m/s) is pleasant; strong wind is not. The steep penalty of
  8 points per m/s reflects that wind becomes unpleasant quickly (10 m/s already
  feels blustery). Weighted in the mid tier because most of the time wind is
  mild and doesn't move the needle.

- **Visibility — 0.15.**
  A proxy for fog, haze, smoke and heavy precipitation — all of which make being
  outdoors worse and are not captured well by the other five parameters. Scaled
  linearly against OpenWeather's 10 km cap.

- **Pressure — 0.10 (low).**
  Some people are pressure-sensitive (headaches, joint pain), and low pressure
  correlates with unsettled weather, but for most people the direct effect is
  small — hence a low weight and a gentle 1.2-points-per-hPa penalty.

- **Cloudiness — 0.10 (low).**
  Overcast skies are a mild comfort/mood factor but rarely decisive, and cloud
  cover already correlates with temperature, humidity and visibility, so it is
  kept low to avoid double-counting.

---

## Trade-offs considered

- **Piecewise-linear penalties vs. a smooth model.**
  A Gaussian or a research-grade index (Humidex, Wind Chill, WBGT, UTCI) would be
  more physically accurate but harder to explain and tune. Linear penalties with
  a single "ideal" point and a slope per parameter are transparent, easy to
  unit-test, and easy to defend in an interview.

- **Independent sub-scores vs. interaction terms.**
  Real comfort has interactions (humidity matters far more at 35 °C than at
  15 °C; wind helps in heat but hurts in cold). Modelling those adds complexity
  and more magic numbers. The current model treats each parameter independently
  and accepts some inaccuracy in extreme combinations.

- **Fixed weights vs. climate-aware weights.**
  Weights are global constants. A tropical city and an arctic city are judged by
  the same "ideal 22 °C". This is simpler and reproducible, at the cost of a
  built-in bias toward temperate climates.

- **`units=metric` from OpenWeather.**
  Temperatures come back in °C directly, so no Kelvin conversion is needed in the
  formula. The trade-off is one extra query parameter and a dependency on that
  setting being present.

- **Missing visibility ⇒ score 100.**
  OpenWeather occasionally omits `visibility`. Treating it as "clear" (100)
  rather than 0 avoids unfairly tanking a city for missing data, at the cost of
  being optimistic when visibility genuinely is poor but unreported.

- **Backend-only computation.**
  The spec requires the score to be computed server-side. This also keeps the
  formula in one place and lets the processed result be cached. The cost is that
  the frontend cannot show a live "what-if" recalculation without a round trip.

---

## Cache design

All caching is **server-side and in-memory** (a `Map`), implemented in
`backend/src/cache/weather.cache.ts`.

### Two layers

1. **Raw layer** — the raw OpenWeatherMap JSON for each city, keyed by
   `CityCode`. TTL **5 minutes** (as required). `weather.service.ts` checks this
   before every outbound HTTP call.

2. **Processed layer** — the fully built, ranked response (weather + comfort
   scores + ranks), stored under a single key. TTL **5 minutes**. `weather.routes.ts`
   serves this directly on a hit, so a hot request does **zero** OpenWeather
   calls and **zero** score recomputation.

### Cache status / debug

- Every `/api/weather` response includes `"cache": "HIT"` or `"cache": "MISS"`
  (based on the processed layer). The frontend shows this as a badge.
- `GET /api/cache` returns:
  - the configured TTL,
  - each cached city's freshness and age,
  - **running HIT and MISS counters** for both layers.
- `POST /api/cache/clear` empties both layers and resets the counters — useful
  for demoing a MISS → HIT transition.

### Why this design

- **5 minutes** matches OpenWeather's own update cadence, so fresher caching
  would waste quota without fresher data.
- **In-memory** is the simplest thing that satisfies the requirement for a
  single-instance app. No Redis/DB to run for grading.
- **Two layers** means a cache hit skips *both* the network call *and* the
  ranking work, not just the network call.
- The cache **key is the CityCode**, not the request, so all users share one
  warm cache.

### Cache design limitations

- Not shared across processes — horizontal scaling would need Redis or similar.
- No cache stampede protection: if the processed entry expires while several
  requests arrive together, each may trigger its own upstream fetch batch.
- Cleared on server restart.

---

## Testing

Unit tests for the Comfort Index (bonus item) using Node's built-in test runner:

```bash
cd backend
npm test
```

`comfort.service.test.ts` covers: every sub-score function, clamping to
`[0, 100]`, the "ideal conditions ⇒ 100" case, the range guarantee for harsh
conditions, that a more pleasant city outranks a worse one, missing-visibility
handling, and 2-decimal rounding. **13 tests, all passing.**

---

## Bonus features implemented

- **Dark mode** — toggle in the header, respects the OS preference on first
  visit, choice persisted to `localStorage`.
- **Unit tests** for the Comfort Index (see above).
- **Sorting & filtering on the frontend** — sort by rank / comfort / temperature
  / humidity / wind; filter by weather condition; free-text city search.
- **Graph** — an SVG bar chart comparing current temperature across all cities
  (no charting library; all custom code).
- **City detail modal** — per-city breakdown of all raw weather values with the
  comfort ring, opened from each card.

---

## Known limitations

- **No hourly temperature trend.** The spec's endpoint
  (`/data/2.5/weather`) returns only *current* conditions, so a per-city
  time-series graph is not possible without a second (paid/One-Call) API. The
  temperature graph therefore compares cities at a single point in time.
- **Comfort model is deliberately simple.** Linear penalties, no
  parameter interactions, and a single global "ideal" per parameter — see
  [Trade-offs](#trade-offs-considered). Extreme humidity+heat or wind+cold
  combinations are under-penalised.
- **Missing `visibility` is treated as clear** (score 100), which is optimistic.
- **In-memory cache** — single instance only, lost on restart, no stampede
  protection.
- **`cities.json` is static** and bundled with the backend; there is no admin UI
  to add cities. Two entries have blank `Temp`/`Status` fields, which are unused
  (live data is always fetched).
- **Auth0 dashboard settings** (MFA, disabled signups, whitelist Action) are not
  in source control and must be reproduced manually in a new tenant.
- **MFA is email-based** per the spec; no TOTP/WebAuthn fallback is configured.
```
