import { Router } from "express";
import { getCities } from "../services/city.service";
import { getWeatherForCities } from "../services/weather.service";
import { calculateComfortIndex } from "../services/comfort.service";
import { checkJwt } from "../middleware/auth.middleware";
import {
  getCachedProcessed,
  setCachedProcessed,
} from "../cache/weather.cache";

const router = Router();

// Get weather + comfort index + ranking for all cities
router.get("/", checkJwt, async (req, res) => {
  try {
    // Serve the fully processed, ranked list from cache when it is still fresh.
    const cached = getCachedProcessed();

    if (cached) {
      return res.json({ ...cached, cache: "HIT" });
    }

    const citiesData = getCities();

    const results = await getWeatherForCities(citiesData.List);

    const citiesWithComfort = results.map((city) => {
      const comfortIndex = calculateComfortIndex(city.weather);

      return {
        CityCode: city.CityCode,
        CityName: city.CityName,
        temperature: city.weather.main.temp,
        humidity: city.weather.main.humidity,
        windSpeed: city.weather.wind.speed,
        visibility: city.weather.visibility ?? null,
        pressure: city.weather.main.pressure,
        cloudiness: city.weather.clouds.all,
        weather: city.weather.weather[0].main,
        description: city.weather.weather[0].description,
        comfortIndex,
      };
    });

    // Rank from Most Comfortable (highest score) to Least Comfortable.
    citiesWithComfort.sort((a, b) => b.comfortIndex - a.comfortIndex);

    const ranked = citiesWithComfort.map((city, index) => ({
      rank: index + 1,
      ...city,
    }));

    const payload = {
      count: ranked.length,
      generatedAt: new Date().toISOString(),
      cities: ranked,
    };

    setCachedProcessed(payload);

    res.json({ ...payload, cache: "MISS" });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch weather data",
    });
  }
});

export default router;
