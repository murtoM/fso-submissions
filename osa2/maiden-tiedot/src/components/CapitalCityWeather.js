import { useEffect, useState } from "react";

import { fetchCityWeather, getWeatherIconURL } from "../services/weatherData";

const CapitalCityWeatherDisplay = ({ country }) => {
  const [capitalCityWeather, setCapitalCityWeather] = useState(null);

  useEffect(() => {
    const setNewWeatherData = async () => {
      setCapitalCityWeather(
        await fetchCityWeather(country.capital[0], country.cca2)
      );
    };

    try {
      if (process.env.REACT_APP_WEATHER_API_KEY !== undefined)
        setNewWeatherData();
    } catch (e) {
      console.error("Something went wrong fetching weather data:", e);
    }
  }, [country]);

  if (process.env.REACT_APP_WEATHER_API_KEY === undefined)
    return (
      <p>
        <small>
          No weather API key defined, please assing the API key as{" "}
          <code>REACT_APP_WEATHER_API_KEY</code> environment variable.
        </small>
      </p>
    );

  if (country.capital.length < 1) return null;

  if (capitalCityWeather === null) return <p>Fetching weather data...</p>;

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>
      <CapitalCityWeather data={capitalCityWeather} />
    </div>
  );
};

const CapitalCityWeather = ({ data }) => (
  <div>
    <div>Temperature {data.main.temp} Celsius</div>
    <img
      src={getWeatherIconURL(data.weather[0].icon)}
      alt={`Icon representing ${data.weather[0].description}`}
      height="150"
    />
    <div>Wind {data.wind.speed} m/s</div>
  </div>
);

export { CapitalCityWeatherDisplay };
