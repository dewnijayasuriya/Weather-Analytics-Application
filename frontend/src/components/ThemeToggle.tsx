interface Props {
  theme: "light" | "dark";
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className="rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-base leading-none"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
