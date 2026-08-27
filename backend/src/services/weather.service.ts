import axios from "axios";
import dotenv from "dotenv";
import { getCachedWeather, setCachedWeather } from "../cache/weather.cache";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

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
  const results = [];

  for (const city of cities) {
    try {
      const weather = await getWeatherByCityCode(city.CityCode);

      results.push({
        CityCode: city.CityCode,
        CityName: city.CityName,
        weather: weather,
      });
    } catch (error) {
      console.error(`Failed to get weather for ${city.CityName}:`, error);
    }
  }

  return results;
};
