import { useState } from "react";

import { create as pushNewPersonToServer } from "../services/persons";

export const NewPersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const addNewPersonHandler = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else if (newName !== "") {
      pushNewPersonToServer({ name: newName, number: newNumber })
        .then((newPerson) => {
          setPersons(persons.concat(newPerson));
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <h3>Add a new</h3>
      <form onSubmit={addNewPersonHandler}>
        <TextInput
          label="name:"
          value={newName}
          onChangeHandler={(event) => setNewName(event.target.value)}
        />
        <TextInput
          label="number:"
          value={newNumber}
          onChangeHandler={(event) => setNewNumber(event.target.value)}
        />
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const TextInput = ({ label, value, onChangeHandler }) => (
  <div>
    {label}
    <input value={value} onChange={onChangeHandler} />
  </div>
);
