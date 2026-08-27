import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

export const getWeatherByCityCode = async (cityCode: string) => {
  if (!API_KEY) {
    throw new Error("OPENWEATHER_API_KEY is not configured");
  }

  const response = await axios.get(
    "https://api.openweathermap.org/data/2.5/weather",
    {
      params: {
        id: cityCode,
        appid: API_KEY,
        units: "metric",
      },
    }
  );

  return response.data;
};