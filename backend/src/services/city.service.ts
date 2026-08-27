import fs from "fs";
import path from "path";

const citiesPath = path.join(__dirname, "../data/cities.json");

export const getCities = () => {
  const data = fs.readFileSync(citiesPath, "utf-8");

  return JSON.parse(data);
};