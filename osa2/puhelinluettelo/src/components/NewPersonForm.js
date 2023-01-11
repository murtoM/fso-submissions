import { useState } from "react";

import * as Handlers from "../handlers";

export const NewPersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const addNewPersonHandler = Handlers.addNewPersonHandlerGenerator(
    persons,
    setPersons,
    newName,
    setNewName,
    newNumber,
    setNewNumber
  );

  return (
    <form onSubmit={addNewPersonHandler}>
      <TextInput
        label="name:"
        value={newName}
        onChangeHandler={Handlers.inputChangeHandler(setNewName)}
      />
      <TextInput
        label="number:"
        value={newNumber}
        onChangeHandler={Handlers.inputChangeHandler(setNewNumber)}
      />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const TextInput = ({ label, value, onChangeHandler }) => (
  <div>
    {label}
    <input value={value} onChange={onChangeHandler} />
  </div>
);
