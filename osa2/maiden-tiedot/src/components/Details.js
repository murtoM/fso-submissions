import { CapitalCityWeatherDisplay } from "./CapitalCityWeather";

const CountryDetails = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <MainInfo country={country} />
    <Languages country={country} />
    <Flag country={country} />
    <CapitalCityWeatherDisplay country={country} />
  </div>
);

const MainInfo = ({ country }) => (
  <div>
    {country.capital.length === 1 && <div>capital {country.capital[0]}</div>}
    {country.capital.length > 1 && (
      <div>capitals {country.capital.join(", ")}</div>
    )}
    <div>area {country.area}</div>
  </div>
);

const Languages = ({ country }) => {
  if (Object.keys(country.languages).length === 1) {
    return (
      <div>
        <h3>Language:</h3>
        <p>{country.languages[Object.keys(country.languages)[0]]}</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Languages:</h3>
      <ul>
        {Object.keys(country.languages).map((key) => (
          <li key={key}>{country.languages[key]}</li>
        ))}
      </ul>
    </div>
  );
};

const Flag = ({ country }) => (
  <img
    src={country.flags.png}
    alt={`Flag of ${country.name.common}`}
    height="150"
  />
);

export default CountryDetails;
