// Calculate comfort score based on how close
// the temperature is to the ideal temperature.
export const calculateTemperatureScore = (temp: number): number => {
  const idealTemp = 22; // °C
  const penaltyRate = 3;

  const score =
    100 - Math.abs(temp - idealTemp) * penaltyRate;

  return Math.max(0, Math.min(100, score));
};


// Calculate comfort score based on humidity.
export const calculateHumidityScore = (humidity: number): number => {
  const idealHumidity = 50; // %
  const penaltyRate = 1.5;

  const score =
    100 - Math.abs(humidity - idealHumidity) * penaltyRate;

  return Math.max(0, Math.min(100, score));
};


// Calculate comfort score based on wind speed.
export const calculateWindScore = (windSpeed: number): number => {
  const idealWind = 2; // m/s
  const penaltyRate = 8;

  const score =
    100 - Math.abs(windSpeed - idealWind) * penaltyRate;

  return Math.max(0, Math.min(100, score));
};


// Calculate comfort score based on visibility.
// OpenWeather provides visibility in metres.
// 10,000m is treated as maximum visibility.
// When OpenWeather omits visibility we assume clear conditions
// rather than penalising the city with a 0 score.
export const calculateVisibilityScore = (
  visibility: number | null | undefined
): number => {
  if (visibility === null || visibility === undefined) {
    return 100;
  }

  const score = (visibility / 10000) * 100;

  return Math.max(0, Math.min(100, score));
};


// Calculate comfort score based on cloudiness.
// Lower cloudiness = higher comfort score.
export const calculateCloudinessScore = (
  cloudiness: number
): number => {
  const penaltyRate = 0.6;

  const score = 100 - cloudiness * penaltyRate;

  return Math.max(0, Math.min(100, score));
};


// Calculate the final Comfort Index.
export const calculateComfortIndex = (weather: any): number => {
  const temperatureScore = calculateTemperatureScore(
    weather.main.temp
  );

  const humidityScore = calculateHumidityScore(
    weather.main.humidity
  );

  const windScore = calculateWindScore(
    weather.wind.speed
  );

  const visibilityScore = calculateVisibilityScore(
    weather.visibility
  );

  const cloudinessScore = calculateCloudinessScore(
    weather.clouds.all
  );


  // Weighted Comfort Index
  const score =
    temperatureScore * 0.30 +
    humidityScore * 0.25 +
    windScore * 0.20 +
    visibilityScore * 0.15 +
    cloudinessScore * 0.10;

  // Return score rounded to 2 decimal places.
  return Number(score.toFixed(2));
};