import dotenv from "dotenv";

// Load environment variables once, before any other module reads process.env.
dotenv.config();

const required = ["OPENWEATHER_API_KEY", "AUTH0_DOMAIN", "AUTH0_AUDIENCE"];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.warn(
    `[env] Missing environment variables: ${missing.join(", ")}. ` +
      `See .env.example.`,
  );
}

export const env = {
  port: process.env.PORT || "5000",
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
  auth0Domain: process.env.AUTH0_DOMAIN || "",
  auth0Audience: process.env.AUTH0_AUDIENCE || "",
};
