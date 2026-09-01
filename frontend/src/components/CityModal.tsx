import { useEffect } from "react";
import type { City } from "../api/weather";
import { comfortLabel, comfortTone, toneTextClass } from "../lib/comfort";
import ScoreRing from "./ScoreRing";
import {
  CloseIcon,
  CloudIcon,
  DropletIcon,
  EyeIcon,
  GaugeIcon,
  MapPinIcon,
  ThermometerIcon,
  WindIcon,
} from "./icons";

interface Props {
  city: City;
  onClose: () => void;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
        <span>{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

export default function CityModal({ city, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const tone = comfortTone(city.comfortIndex);
  const visibilityText =
    city.visibility == null
      ? "—"
      : `${(city.visibility / 1000).toFixed(1)} km`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${city.CityName} weather details`}
    >
      <div
        className="my-auto w-full max-w-lg rounded-2xl border border-line bg-surface p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <p className="flex items-center gap-1.5 text-[13px] text-muted">
            <MapPinIcon size={14} />
            {city.CityName} • Rank #{city.rank}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-ink"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="mt-3 flex items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-surface-2 text-muted">
            <CloudIcon size={30} />
          </span>
          <div>
            <p className="text-4xl font-extrabold">
              {Math.round(city.temperature)}
              <span className="text-xl font-semibold text-muted">°C</span>
            </p>
            <p className="capitalize text-muted">{city.weather} · {city.description}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-2xl border border-line bg-surface-2 p-4">
          <ScoreRing score={city.comfortIndex} size={72} strokeWidth={6} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Comfort Index
            </p>
            <p className={`text-2xl font-extrabold ${toneTextClass(tone)}`}>
              {comfortLabel(city.comfortIndex)}
            </p>
            <p className="text-[13px] text-muted">
              {city.comfortIndex.toFixed(1)} / 100
            </p>
          </div>
        </div>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted">
          Current conditions
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <DetailRow
            icon={<DropletIcon size={13} />}
            label="Humidity"
            value={`${city.humidity}%`}
          />
          <DetailRow
            icon={<WindIcon size={13} />}
            label="Wind speed"
            value={`${city.windSpeed.toFixed(1)} m/s`}
          />
          <DetailRow
            icon={<CloudIcon size={13} />}
            label="Cloud cover"
            value={`${city.cloudiness}%`}
          />
          <DetailRow
            icon={<GaugeIcon size={13} />}
            label="Pressure"
            value={`${city.pressure} hPa`}
          />
          <DetailRow
            icon={<EyeIcon size={13} />}
            label="Visibility"
            value={visibilityText}
          />
          <DetailRow
            icon={<ThermometerIcon size={13} />}
            label="Temperature"
            value={`${city.temperature.toFixed(1)}°C`}
          />
        </div>
      </div>
    </div>
  );
}
