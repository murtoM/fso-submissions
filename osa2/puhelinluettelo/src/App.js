import { useEffect, useState } from "react";

import { inputChangeHandler } from "./handlers";
import { getAll as getPersonsFromServer } from "./services/persons";

import { NewPersonForm } from "./components/NewPersonForm";

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
      <FilterInput onChangeHandler={inputChangeHandler(setFilter)} />
      <h3>Add a new</h3>
      <NewPersonForm persons={persons} setPersons={setPersons} />
      <h3>Numbers</h3>
      <FilteredPersonList persons={persons} filter={filter} />
    </div>
  );
};

const FilterInput = ({ onChangeHandler }) => (
  <div>
    filter shown with <input onChange={onChangeHandler} />
  </div>
);

const FilteredPersonList = ({ persons, filter }) => {
  if (filter.length > 0) {
    return (
      <div>
        {persons.map((person) => {
          if (person.name.toLowerCase().includes(filter))
            return <Person key={person.name} person={person} />;
          return null;
        })}
      </div>
    );
  } else {
    return (
      <div>
        {persons.map((person) => (
          <Person key={person.name} person={person} />
        ))}
      </div>
    );
  }
};

const Person = ({ person }) => (
  <p>
    {person.name} {person.number}
  </p>
);

export default App;
