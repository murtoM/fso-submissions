import { COUNTRY_API_FETCH_URL } from "./apiConsts";

const fetchCountries = async () => {
  const data = await (await fetch(COUNTRY_API_FETCH_URL)).json();
  return data;
};

const fetchSortedCountries = async () => {
  const data = await fetchCountries();
  data.sort(sortCountries);
  return data;
};

const sortCountries = (country0, country1) => {
  const name0 = country0.name.common.toLowerCase();
  const name1 = country1.name.common.toLowerCase();

  if (name0 > name1) return 1;
  if (name0 < name1) return -1;
  return 0;
};

export { fetchCountries, fetchSortedCountries };
