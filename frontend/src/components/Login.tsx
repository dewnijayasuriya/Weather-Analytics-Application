import { useAuth0 } from "@auth0/auth0-react";
import { CloudIcon, LogOutIcon } from "./icons";

interface Props {
  authError?: string | null;
  onClearError?: () => void;
}

export default function Login({ authError, onClearError }: Props) {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-brand to-brand-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden
          className="absolute -right-16 -top-16 size-72 rounded-full bg-white/10"
        />
        <div className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white/15">
            <CloudIcon size={24} />
          </span>
          <span className="text-xl font-extrabold">Comfort Index</span>
        </div>

        <div className="relative">
          <h1 className="max-w-md text-4xl font-extrabold leading-tight">
            Weather analytics, ranked by human comfort.
          </h1>
          <p className="mt-4 max-w-md text-white/80">
            A custom Comfort Index blends temperature, humidity, wind, cloud
            cover, visibility and pressure into a single 0–100 score — so you
            see which city feels best, not just what it reports.
          </p>
        </div>

        <p className="relative text-[13px] text-white/70">
          Secured with Auth0 · MFA enforced · restricted access
        </p>
      </div>

      {/* Right: action panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-xl bg-brand text-white">
              <CloudIcon size={22} />
            </span>
            <span className="text-lg font-extrabold">Comfort Index</span>
          </div>

          <h2 className="text-2xl font-extrabold">Sign in</h2>
          <p className="mt-1 text-muted">Access the Comfort Index dashboard</p>

          {authError ? (
            <>
              <div
                role="alert"
                className="mt-6 flex flex-col gap-1 rounded-xl border border-score-bad bg-score-bad/10 px-4 py-3 text-[14px] text-ink"
              >
                <strong>Access denied</strong>
                <span>{authError}</span>
              </div>
              <button
                type="button"
                onClick={onClearError}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white transition hover:brightness-110"
              >
                Back to sign in
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() =>
                loginWithRedirect({
                  authorizationParams: { prompt: "login" },
                })
              }
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 font-semibold text-white transition hover:brightness-110"
            >
              <LogOutIcon size={16} className="rotate-180" />
              Sign in with Auth0
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
