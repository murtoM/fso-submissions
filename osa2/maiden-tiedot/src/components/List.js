const CountryList = ({ countries, handleUserCountrySelect }) => (
  <div>
    {countries.map((country) => (
      <CountryListRow
        key={country.cca2}
        country={country}
        userCountrySelect={handleUserCountrySelect(country.cca2)}
      />
    ))}
  </div>
);

const CountryListRow = ({ country, userCountrySelect }) => (
  <div>
    {country.name.common}
    <button onClick={userCountrySelect}>show</button>
  </div>
);

export default CountryList;