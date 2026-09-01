import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  // Auth0 redirects back with ?error=... when a non-whitelisted user
  // (or one who fails MFA) tries to log in.
  const params = new URLSearchParams(window.location.search);
  const [authError, setAuthError] = useState<string | null>(
    params.get("error_description") ?? params.get("error"),
  );

  const clearError = () => {
    window.history.replaceState({}, document.title, "/");
    setAuthError(null);
  };

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-muted">
        Loading…
      </div>
    );
  }

  if (authError) {
    return <Login authError={authError} onClearError={clearError} />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Dashboard />;
}

export default App;
