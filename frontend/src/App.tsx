import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } =
    useAuth0();

  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  const errorDescription = params.get("error_description");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show Auth0 error
  if (error) {
    return (
      <>
        <h1>Weather Analytics</h1>

        <h2>Access Denied</h2>

        <p>{errorDescription}</p>

        <button
          onClick={() => {
            window.history.replaceState({}, document.title, "/");
            window.location.reload();
          }}
        >
          Back to Login
        </button>
      </>
    );
  }

  // Normal login page
  if (!isAuthenticated) {
    return (
      <>
        <h1>Weather Analytics</h1>

        <button
          onClick={() =>
            loginWithRedirect({
              authorizationParams: {
                prompt: "login",
              },
            })
          }
        >
          Login
        </button>
      </>
    );
  }

  // Authenticated page
  return (
    <>
      <h1>Weather Analytics</h1>

      <h2>Welcome, {user?.email}</h2>

      <button onClick={() => logout()}>Logout</button>
    </>
  );
}

export default App;
