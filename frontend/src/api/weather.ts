const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export interface City {
  rank: number;
  CityCode: string;
  CityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number | null;
  pressure: number;
  cloudiness: number;
  weather: string;
  description: string;
  comfortIndex: number;
}

export interface WeatherResponse {
  count: number;
  generatedAt: string;
  cities: City[];
  cache: "HIT" | "MISS";
}

/**
 * Fetches the ranked city list from the backend.
 * The comfort score and ranking are computed server-side; the frontend
 * only ever displays them.
 */
export async function fetchWeather(token: string): Promise<WeatherResponse> {
  const res = await fetch(`${API_BASE_URL}/api/weather`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error("Your session has expired. Please log in again.");
  }

  if (!res.ok) {
    throw new Error(
      `Failed to load weather data (${res.status}). Is the backend running?`,
    );
  }

  return res.json();
}
