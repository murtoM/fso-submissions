import { useState, useEffect } from "react";

import { fetchCountries } from "./services/fetchData";

import Filter from "./components/Filter";
import Display from "./components/Display";

const App = () => {
  const API_URL = "https://restcountries.com";
  const API_ENDPOINT_VERSION = "v3.1";

  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const setNewCountryData = async () =>
    setCountries(await fetchCountries(API_URL, API_ENDPOINT_VERSION));

  useEffect(() => {
    try {
      setNewCountryData();
    } catch (e) {
      console.error("Something went wrong fetching data:", e);
    }
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSelectedCountry(null);
  };

  const handleUserCountrySelect = (cca2) => () => setSelectedCountry(cca2);

  return (
    <div>
      <Filter onChangeHandler={handleFilterChange} />
      <Display
        countries={countries}
        filter={filter}
        handleUserCountrySelect={handleUserCountrySelect}
        selectedCountry={selectedCountry}
      />
    </div>
  );
};

export default App;
