import { useEffect, useState } from "react";

import { getAll as getPersonsFromServer } from "./services/persons";

import { NewPersonForm } from "./components/NewPersonForm";
import { PersonList } from "./components/PersonList";
import { Notification } from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({});

  useEffect(() => {
    getPersonsFromServer()
      .then((fetchedPersons) => setPersons(fetchedPersons))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <FilterInput onChangeHandler={(event) => setFilter(event.target.value)} />
      <NewPersonForm
        persons={persons}
        setPersons={setPersons}
        setNotification={setNotification}
      />
      <PersonList
        persons={persons}
        setPersons={setPersons}
        filter={filter}
        setNotification={setNotification}
      />
    </div>
  );
};

const FilterInput = ({ onChangeHandler }) => (
  <div>
    filter shown with <input onChange={onChangeHandler} />
  </div>
);

export default App;
