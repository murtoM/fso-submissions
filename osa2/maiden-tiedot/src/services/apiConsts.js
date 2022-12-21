const COUNTRY_API_URL = "https://restcountries.com";
const COUNTRY_API_ENDPOINT_VERSION = "v3.1";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const COUNTRY_API_FETCH_URL = `${COUNTRY_API_URL}/${COUNTRY_API_ENDPOINT_VERSION}/all`;
const WEATHER_API_FETCH_URL = `${WEATHER_API_URL}?appid=${WEATHER_API_KEY}`;
const WEATHER_ICON_URL = "https://openweathermap.org/img/wn/";

export { COUNTRY_API_FETCH_URL, WEATHER_API_FETCH_URL, WEATHER_ICON_URL };
