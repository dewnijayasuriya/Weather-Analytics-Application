import { Router } from "express";
import { getCities } from "../services/city.service";
import {
  getWeatherByCityCode,
  getWeatherForCities,
} from "../services/weather.service";
import { calculateComfortIndex } from "../services/comfort.service";
import { checkJwt } from "../middleware/auth.middleware";

const router = Router();

// Get weather for all cities
router.get("/", checkJwt, async (req, res) => {
  try {
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
        visibility: city.weather.visibility ?? 0,
        pressure: city.weather.main.pressure,
        cloudiness: city.weather.clouds.all,
        weather: city.weather.weather[0].main,
        description: city.weather.weather[0].description,
        comfortIndex,
      };
    });

    // Highest comfort score first
    citiesWithComfort.sort((a, b) => b.comfortIndex - a.comfortIndex);

    res.json({
      count: citiesWithComfort.length,
      cities: citiesWithComfort,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch weather data",
    });
  }
});

export default router;
