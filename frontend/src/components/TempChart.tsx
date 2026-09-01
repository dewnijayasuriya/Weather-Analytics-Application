import type { City } from "../api/weather";
import { TrendingUpIcon } from "./icons";

interface Props {
  cities: City[];
}

/**
 * Inline-SVG bar chart of current temperature per city.
 * No charting dependency - keeps the bundle small and the code our own.
 * (OpenWeather's current-weather endpoint has no hourly history, so a
 *  per-city time trend is not possible with the specified API.)
 */
export default function TempChart({ cities }: Props) {
  if (cities.length === 0) return null;

  const data = [...cities].sort((a, b) => b.temperature - a.temperature);
  const temps = data.map((c) => c.temperature);
  const max = Math.max(...temps, 0);
  const min = Math.min(...temps, 0);
  const range = max - min || 1;

  const barHeight = 24;
  const gap = 12;
  const labelWidth = 96;
  const chartWidth = 340;
  const height = data.length * (barHeight + gap);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="mb-4 flex items-center gap-2 font-bold">
        <span className="text-muted">
          <TrendingUpIcon size={16} />
        </span>
        Temperature Comparison by City (°C)
      </h2>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${labelWidth + chartWidth + 48} ${height}`}
          role="img"
          aria-label="Bar chart of current temperature by city"
          className="h-auto w-full min-w-105"
        >
          {data.map((city, i) => {
            const y = i * (barHeight + gap);
            const width = ((city.temperature - min) / range) * chartWidth;
            return (
              <g key={city.CityCode}>
                <text
                  x={labelWidth - 8}
                  y={y + barHeight / 2}
                  textAnchor="end"
                  dominantBaseline="central"
                  className="fill-muted text-[12px]"
                >
                  {city.CityName}
                </text>
                <rect
                  x={labelWidth}
                  y={y}
                  width={Math.max(width, 3)}
                  height={barHeight}
                  rx={5}
                  className="fill-brand"
                />
                <text
                  x={labelWidth + Math.max(width, 3) + 8}
                  y={y + barHeight / 2}
                  dominantBaseline="central"
                  className="fill-ink text-[12px] font-semibold"
                >
                  {Math.round(city.temperature)}°
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
