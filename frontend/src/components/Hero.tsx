import type { City } from "../api/weather";
import { comfortLabel } from "../lib/comfort";

interface Props {
  city: City;
}

/** "Most comfortable right now" gradient banner - always the rank #1 city. */
export default function Hero({ city }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand to-brand-dark p-6 text-white sm:p-8">
      <div
        aria-hidden
        className="absolute -right-10 -top-10 size-64 rounded-full bg-white/10"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 right-16 size-56 rounded-full bg-white/5"
      />

      <div className="relative">
        <p className="text-[13px] font-medium uppercase tracking-wide text-white/80">
          Most comfortable right now
        </p>

        <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            {city.CityName}
          </h2>
          <span className="text-lg capitalize text-white/85">
            {city.description}
          </span>
        </div>

        <div className="mt-5 flex gap-10">
          <div>
            <p className="text-[13px] text-white/75">Comfort score</p>
            <p className="text-2xl font-extrabold sm:text-3xl">
              {city.comfortIndex.toFixed(0)}
              <span className="text-base font-semibold text-white/70">/100</span>
            </p>
            <p className="text-[13px] text-white/75">{comfortLabel(city.comfortIndex)}</p>
          </div>
          <div>
            <p className="text-[13px] text-white/75">Temperature</p>
            <p className="text-2xl font-extrabold sm:text-3xl">
              {Math.round(city.temperature)}
              <span className="text-base font-semibold text-white/70">°C</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
