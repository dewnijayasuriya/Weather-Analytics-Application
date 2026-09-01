import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import { fetchWeather, type City, type WeatherResponse } from "../api/weather";
import { useTheme } from "../hooks/useTheme";
import CityCard from "./CityCard";
import CityModal from "./CityModal";
import Chips from "./Chips";
import Hero from "./Hero";
import StatTile from "./StatTile";
import TempChart from "./TempChart";
import ThemeToggle from "./ThemeToggle";
import {
  ActivityIcon,
  CloudIcon,
  DatabaseIcon,
  LogOutIcon,
  RefreshIcon,
  SearchIcon,
  TrendingUpIcon,
} from "./icons";

type SortKey = "rank" | "comfort" | "temp" | "humidity" | "wind";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rank", label: "Rank" },
  { value: "comfort", label: "Comfort" },
  { value: "temp", label: "Temp" },
  { value: "humidity", label: "Humidity" },
  { value: "wind", label: "Wind" },
];

const btnGhost =
  "inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[13px] font-semibold text-ink transition hover:bg-surface-2";
const panel =
  "rounded-2xl border border-line bg-surface p-10 text-center text-muted";

export default function Dashboard() {
  const { user, logout, getAccessTokenSilently } = useAuth0();
  const { theme, toggleTheme } = useTheme();

  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("all");
  const [sort, setSort] = useState<SortKey>("rank");
  const [selected, setSelected] = useState<City | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const token = await getAccessTokenSilently();
        const result = await fetchWeather(token);
        if (active) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [getAccessTokenSilently, reloadKey]);

  const refresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const conditionOptions = useMemo(() => {
    const set = new Set((data?.cities ?? []).map((c) => c.weather));
    return [
      { value: "all", label: "All" },
      ...Array.from(set)
        .sort()
        .map((c) => ({ value: c, label: c })),
    ];
  }, [data]);

  const visibleCities = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();

    const list = data.cities.filter((c) => {
      const matchesSearch = c.CityName.toLowerCase().includes(q);
      const matchesCondition = condition === "all" || c.weather === condition;
      return matchesSearch && matchesCondition;
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "comfort":
          return b.comfortIndex - a.comfortIndex;
        case "temp":
          return b.temperature - a.temperature;
        case "humidity":
          return a.humidity - b.humidity;
        case "wind":
          return a.windSpeed - b.windSpeed;
        default:
          return a.rank - b.rank;
      }
    });
  }, [data, search, condition, sort]);

  const avgComfort = useMemo(() => {
    if (!data || data.cities.length === 0) return 0;
    const sum = data.cities.reduce((acc, c) => acc + c.comfortIndex, 0);
    return sum / data.cities.length;
  }, [data]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-6">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-brand text-white">
            <CloudIcon size={22} />
          </span>
          <div>
            <h1 className="text-lg font-extrabold leading-tight">
              Weather Comfort Dashboard
            </h1>
            <p className="text-[13px] text-muted">Compare weather conditions and comfort scores across cities</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <span className="hidden text-[13px] text-muted sm:inline">
            Signed in as{" "}
            <span className="font-semibold text-ink">{user?.email}</span>
          </span>
          <button
            type="button"
            className={btnGhost}
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            <LogOutIcon size={14} />
            Sign out
          </button>
        </div>
      </header>

      {loading && !data && (
        <div className={`${panel} grid min-h-[50vh] place-items-center`}>
          Loading weather data…
        </div>
      )}

      {error && !data && (
        <div role="alert" className={`${panel} border-score-bad text-ink`}>
          <p>{error}</p>
          <button
            type="button"
            className={`${btnGhost} mx-auto mt-3`}
            onClick={refresh}
          >
            <RefreshIcon size={14} />
            Try again
          </button>
        </div>
      )}

      {data && (
        <>
          {/* Hero + stat tiles */}
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {visibleCities[0] ? (
              <Hero city={data.cities[0]} />
            ) : (
              <div className={panel}>No cities available.</div>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <StatTile
                icon={<ActivityIcon size={18} />}
                label="Average Comfort Score"
                value={`${avgComfort.toFixed(0)}/100`}
              />
              <StatTile
                icon={<TrendingUpIcon size={18} />}
                label="Cities Compared"
                value={data.count}
              />
            </div>
          </div>

          {/* Cache / refresh bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
            <span className="flex items-center gap-2 text-[13px] text-muted">
              <DatabaseIcon size={15} />
              Data Status:
              <span
                className={
                  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[12px] font-bold " +
                  (data.cache === "HIT"
                    ? "border-score-great text-score-great"
                    : "border-score-poor text-score-poor")
                }
              >
                <span
                  className={
                    "size-1.5 rounded-full " +
                    (data.cache === "HIT"
                      ? "bg-score-great"
                      : "bg-score-poor")
                  }
                />
                {data.cache}
              </span>
            </span>
            <span className="text-[13px] text-muted">
              · Updated{" "}
              {new Date(data.generatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · Refreshes every 5 min
            </span>
            <button
              type="button"
              className={`${btnGhost} ml-auto`}
              onClick={refresh}
              disabled={loading}
            >
              <RefreshIcon size={14} />
              {loading ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 basis-60">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                <SearchIcon size={16} />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by city..."
                aria-label="Search city by name"
                className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-[14px] text-ink"
              />
            </div>
            <Chips
              ariaLabel="Filter by weather condition"
              options={conditionOptions}
              active={condition}
              onChange={setCondition}
            />
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-muted">Sort</span>
              <Chips
                ariaLabel="Sort cities"
                options={SORT_OPTIONS}
                active={sort}
                onChange={(v) => setSort(v as SortKey)}
              />
            </div>
          </div>

          {/* City grid */}
          {visibleCities.length === 0 ? (
            <div className={`${panel} mt-4`}>No cities match your filters.</div>
          ) : (
            <section className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleCities.map((city) => (
                <CityCard key={city.CityCode} city={city} onOpen={setSelected} />
              ))}
            </section>
          )}

          <div className="mt-6">
            <TempChart cities={visibleCities} />
          </div>
        </>
      )}

      {selected && (
        <CityModal city={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
