const CountryDetails = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <MainInfo country={country} />
    <Languages country={country} />
    <Flag country={country} />
  </div>
);

const MainInfo = ({ country }) => (
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