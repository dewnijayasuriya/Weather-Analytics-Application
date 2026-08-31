import axios from "axios";
import { env } from "../config/env";
import { getCachedWeather, setCachedWeather } from "../cache/weather.cache";

const API_KEY = env.openWeatherApiKey;

export const getWeatherByCityCode = async (cityCode: string) => {
  if (!API_KEY) {
    throw new Error("OPENWEATHER_API_KEY is not configured");
  }

  // Check cache first
  const cachedWeather = getCachedWeather(cityCode);

  if (cachedWeather) {
    console.log(`CACHE HIT: ${cityCode}`);
    return cachedWeather;
  }

  console.log(`CACHE MISS: ${cityCode}`);

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        id: cityCode,
        appid: API_KEY,
        units: "metric",
      },
    },
  );

  // Save raw OpenWeather response in cache
  setCachedWeather(cityCode, response.data);

  return response.data;
};

export const getWeatherForCities = async (cities: any[]) => {
  // Fetch all cities in parallel; the per-city cache means most calls
  // resolve instantly on subsequent requests.
  const settled = await Promise.allSettled(
    cities.map(async (city) => ({
      CityCode: city.CityCode,
      CityName: city.CityName,
      weather: await getWeatherByCityCode(city.CityCode),
    })),
  );

  const results: any[] = [];

  settled.forEach((outcome, index) => {
    if (outcome.status === "fulfilled") {
      results.push(outcome.value);
    } else {
      console.error(
        `Failed to get weather for ${cities[index].CityName}:`,
        outcome.reason?.message ?? outcome.reason,
      );
    }
  });

  return results;
};
