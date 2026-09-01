/**
 * Small inline SVG icon set (stroke-based, currentColor).
 * Kept local so the app has zero icon-library dependency.
 */
type IconProps = {
  size?: number;
  className?: string;
};

function base(size: number, className: string | undefined, path: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}

export const ThermometerIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />,
  );

export const DropletIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  );

export const WindIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
      <path d="M12.59 19.41A2 2 0 1 0 14 16H2" />
      <path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" />
    </>,
  );

export const CloudIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />,
  );

export const EyeIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </>,
  );

export const GaugeIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <path d="M12 15l3.5-3.5" />
      <path d="M20.3 18a9 9 0 1 0-16.6 0" />
    </>,
  );

export const ActivityIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  );

export const TrendingUpIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </>,
  );

export const DatabaseIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </>,
  );

export const RefreshIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </>,
  );

export const SunIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </>,
  );

export const MoonIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  );

export const LogOutIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>,
  );

export const SearchIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </>,
  );

export const CloseIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <path d="M18 6L6 18M6 6l12 12" />,
  );

export const MapPinIcon = ({ size = 16, className }: IconProps) =>
  base(
    size,
    className,
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>,
  );
