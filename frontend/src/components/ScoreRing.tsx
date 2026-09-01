import { comfortTone, toneColor } from "../lib/comfort";

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
}

/**
 * Circular progress ring for a 0-100 comfort score.
 * Pure SVG - the colour follows the comfort tone.
 */
export default function ScoreRing({
  score,
  size = 56,
  strokeWidth = 5,
  showValue = true,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const color = toneColor(comfortTone(score));

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Comfort score ${score.toFixed(0)} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      {showValue && (
        <span
          className="absolute inset-0 flex items-center justify-center font-extrabold"
          style={{ fontSize: size * 0.3, color }}
        >
          {score.toFixed(0)}
        </span>
      )}
    </div>
  );
}
