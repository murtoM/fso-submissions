import { WEATHER_API_FETCH_URL, WEATHER_ICON_URL } from "./apiConsts";

const fetchCityWeather = async (city, country) => {
  const CITY_URL = `${WEATHER_API_FETCH_URL}&units=metric&q=${city},${country}`;
  const data = await (await fetch(CITY_URL)).json();
  return data;
};

const getWeatherIconURL = (iconCode) => `${WEATHER_ICON_URL}${iconCode}@4x.png`;

export { fetchCityWeather, getWeatherIconURL };
