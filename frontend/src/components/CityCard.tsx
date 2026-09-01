import type { City } from "../api/weather";
import { comfortLabel, comfortTone, toneTextClass } from "../lib/comfort";
import ScoreRing from "./ScoreRing";
import { CloudIcon, DropletIcon, EyeIcon, WindIcon } from "./icons";

interface Props {
  city: City;
  onOpen: (city: City) => void;
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 px-2 py-2.5 text-center">
      <span className="text-muted">{icon}</span>
      <span className="text-[13px] font-bold leading-none">{value}</span>
      <span className="text-[11px] leading-none text-muted">{label}</span>
    </div>
  );
}

export default function CityCard({ city, onOpen }: Props) {
  const tone = comfortTone(city.comfortIndex);
  const visibilityText =
    city.visibility == null ? "—" : `${Math.round(city.visibility / 1000)}km`;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_10px_24px_rgba(16,24,40,0.06)]">
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted">
            <CloudIcon size={20} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold leading-tight">
              <span className="text-muted">#{city.rank}</span> {city.CityName}
            </h3>
            <p className="truncate text-[13px] capitalize text-muted">
              {city.description}
            </p>
          </div>
        </div>
        <ScoreRing score={city.comfortIndex} size={52} strokeWidth={6} />
      </header>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-3xl font-extrabold">
          {Math.round(city.temperature)}
          <span className="text-lg font-semibold text-muted">°C</span>
        </p>
        <div className="flex items-center gap-3">
          <span className={`text-[13px] font-semibold ${toneTextClass(tone)}`}>
            {comfortLabel(city.comfortIndex)}
          </span>
          <button
            type="button"
            onClick={() => onOpen(city)}
            className="text-[13px] font-semibold text-brand hover:underline"
          >
            Details ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <Metric
          icon={<DropletIcon size={16} />}
          value={`${city.humidity}%`}
          label="Humidity"
        />
        <Metric
          icon={<WindIcon size={16} />}
          value={city.windSpeed.toFixed(1)}
          label="m/s"
        />
        <Metric
          icon={<CloudIcon size={16} />}
          value={`${city.cloudiness}%`}
          label="Clouds"
        />
        <Metric
          icon={<EyeIcon size={16} />}
          value={visibilityText}
          label="Visibility"
        />
      </div>
    </article>
  );
}
