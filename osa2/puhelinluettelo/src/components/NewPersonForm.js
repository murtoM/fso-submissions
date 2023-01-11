import { useState } from "react";

import * as Persons from "../services/persons";

export const NewPersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const addNewPersonHandler = (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number  with a new one?`
        )
      ) {
        Persons.update({
          id: persons.find((person) => person.name === newName).id,
          name: newName,
          number: newNumber,
        })
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== updatedPerson.id ? person : updatedPerson
              )
            );
          })
          .catch((error) => console.error(error));
      }
    } else if (newName !== "") {
      Persons.create({ name: newName, number: newNumber })
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
