import { useEffect, useState } from "react";

import { getAll as getPersonsFromServer } from "./services/persons";

import { NewPersonForm } from "./components/NewPersonForm";
import { PersonList } from "./components/PersonList";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getPersonsFromServer()
      .then((fetchedPersons) => setPersons(fetchedPersons))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterInput onChangeHandler={(event) => setFilter(event.target.value)} />
      <NewPersonForm persons={persons} setPersons={setPersons} />
      <PersonList persons={persons} setPersons={setPersons} filter={filter} />
    </div>
  );
};

const FilterInput = ({ onChangeHandler }) => (
  <div>
    filter shown with <input onChange={onChangeHandler} />
  </div>
);

export default App;
