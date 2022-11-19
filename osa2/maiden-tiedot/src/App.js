import { useState, useEffect } from "react";

const App = () => {
  const API_URL = "https://restcountries.com";
  const API_ENDPOINT_VERSION = "v3.1";

  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchSortedCountries = async () => {
    const URL = `${API_URL}/${API_ENDPOINT_VERSION}/all`;
    const data = await (await fetch(URL)).json();
    data.sort((country0, country1) => {
      const name0 = country0.name.common.toLowerCase();
      const name1 = country1.name.common.toLowerCase();

      if (name0 > name1) return 1;
      if (name0 < name1) return -1;
      return 0;
    });
    setCountries(data);
  };

  useEffect(() => {
    try {
      fetchSortedCountries();
    } catch (e) {
      console.log("Something went wrong fetching data:", e);
    }
  }, []);

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  return (
    <div>
      <Filter onChangeHandler={handleInputChange(setFilter)} />
      <CountriesDisplay countries={countries} filter={filter} />
    </div>
  );
};

const Filter = ({ onChangeHandler }) => (
  <div>
    find countries <input onChange={onChangeHandler} />
  </div>
);

const CountriesDisplay = ({ countries, filter }) => {
  if (filter.length === 0) {
    if (countries.length <= 10) return <CountryList countries={countries} />;
    else return <p>Specify a filter</p>;
  }

  const filteredCountries = countries.reduce((filtered, country) => {
    if (country.name.common.toLowerCase().includes(filter))
      filtered.push(country);

    return filtered;
  }, []);

  if (filteredCountries.length > 10)
    return <p>Too many matches, specify another filter</p>;
  else if (filteredCountries.length === 1)
    return <CountryDetails country={filteredCountries[0]} />;
  else if (filteredCountries.length < 1)
    return <p>No matches, specify another filter</p>;

  return <CountryList countries={filteredCountries} />;
};

const CountryList = ({ countries }) => (
  <div>
    {countries.map((country) => (
      <CountryListRow key={country.cca2} country={country} />
    ))}
  </div>
);

const CountryListRow = ({ country }) => <div>{country.name.common}</div>;

const CountryDetails = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <CountryMainDetails country={country} />
    <CountryLanguageDetails country={country} />
    <CountryFlag country={country} />
  </div>
);

const CountryMainDetails = ({ country }) => (
  <p>
    {country.capital.length === 1 && (
      <>
        capital {country.capital[0]}
        <br />
      </>
    )}
    {country.capital.length > 1 && (
      <>
        capitals {country.capital.join(", ")}
        <br />
      </>
    )}
    area {country.area}
  </p>
);

const CountryLanguageDetails = ({ country }) => {
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

const CountryFlag = ({ country }) => (
  <img
    src={country.flags.png}
    alt={`Flag of ${country.name.common}`}
    height="150"
  />
);

export default App;
