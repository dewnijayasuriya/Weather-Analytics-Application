interface Props {
  options: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}

/** Segmented pill group used for both condition filtering and sorting. */
export default function Chips({ options, active, onChange, ariaLabel }: Props) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1"
    >
      {options.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(opt.value)}
            className={
              "rounded-lg px-3 py-1.5 text-[13px] font-semibold transition " +
              (isActive
                ? "bg-brand text-white"
                : "text-muted hover:bg-surface-2 hover:text-ink")
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
