const fetchCountries = async (api_url, api_endpoint_version) => {
  const URL = `${api_url}/${api_endpoint_version}/all`;
  const data = await (await fetch(URL)).json();
  return data;
};

const fetchSortedCountries = async (api_url, api_endpoint_version) => {
  const data = await fetchCountries(api_url, api_endpoint_version);
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
