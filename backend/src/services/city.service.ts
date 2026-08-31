import citiesData from "../data/cities.json";

interface CityEntry {
  CityCode: string;
  CityName: string;
  Temp: string;
  Status: string;
}

interface CitiesFile {
  List: CityEntry[];
}

// cities.json ships with the source and is bundled at compile time,
// so this works the same in dev (ts-node) and prod (node dist/).
export const getCities = (): CitiesFile => citiesData as CitiesFile;
