import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1231244" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const handleInputChange = (setter) => (event) => setter(event.target.value);

  const addNewPerson = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name == newName)) {
      alert(`${newName} is already added to phonebook`);
    } else if (newName != "") {
      setPersons(persons.concat({ name: newName, number: newNumber }));
      setNewName("");
      setNewNumber("");
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterInput onChangeHandler={handleInputChange(setFilter)} />
      <h3>add a new</h3>
      <form onSubmit={addNewPerson}>
        <div>
          name:{" "}
          <input value={newName} onChange={handleInputChange(setNewName)} />
        </div>
        <div>
          number:{" "}
          <input value={newNumber} onChange={handleInputChange(setNewNumber)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
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
