import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export default function StatTile({ icon, label, value }: Props) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-muted">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[13px] text-muted">{label}</p>
        <p className="truncate text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
