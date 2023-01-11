import { pushNew as pushNewPersonToServer } from "./services/persons";

const inputChangeHandler = (setter) => (event) => setter(event.target.value);

const addNewPersonHandlerGenerator =
  (persons, setPersons, newName, setNewName, newNumber, setNewNumber) =>
  (event) => {
    event.preventDefault();

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else if (newName !== "") {
      const newPerson = { name: newName, number: newNumber };

      pushNewPersonToServer(newPerson)
        .then(() => {
          setPersons(persons.concat(newPerson));
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => console.error(error));
    }
  };

export { inputChangeHandler, addNewPersonHandlerGenerator };
