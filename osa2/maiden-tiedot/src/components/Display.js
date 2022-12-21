import CountryList from "./List";
import CountryDetails from "./Details";

const filterCountries = (countries, filter) => {
  return countries.reduce((filtered, country) => {
    if (country.name.common.toLowerCase().includes(filter))
      filtered.push(country);

    return filtered;
  }, []);
};

const Display = ({
  countries,
  filter,
  handleUserCountrySelect,
  selectedCountry,
}) => {
  if (selectedCountry) {
    const countryToShow = countries.find(
      (country) => selectedCountry === country.cca2
    );
    return <CountryDetails country={countryToShow} />;
  }
  if (filter.length === 0) return <p>Specify a filter</p>;

  const filteredCountries = filterCountries(countries, filter);

  if (filteredCountries.length > 10)
    return <p>Too many matches, specify another filter</p>;
  else if (filteredCountries.length === 1)
    return <CountryDetails country={filteredCountries[0]} />;
  else if (filteredCountries.length < 1)
    return <p>No matches, specify another filter</p>;

  return (
    <CountryList
      countries={filteredCountries}
      handleUserCountrySelect={handleUserCountrySelect}
    />
  );
};

export default Display;
