import { remove as removePerson } from "../services/persons";

export const PersonList = ({ persons, setPersons, filter }) => {
  const createDeleteButtonHandler = (personToDelete) => () => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      removePerson(personToDelete.id)
        .then(() =>
          setPersons(
            persons.filter((person) => person.id !== personToDelete.id)
          )
        )
        .catch((error) => console.error(error));
    }
  };

  if (filter.length > 0) {
    return (
      <div>
        <h3>Numbers</h3>
        {persons.map((person) => {
          if (person.name.toLowerCase().includes(filter))
            return (
              <Person
                key={person.name}
                person={person}
                deleteButton={
                  <PersonDeleteButton
                    onClickHandler={createDeleteButtonHandler(person)}
                  />
                }
              />
            );
          return null;
        })}
      </div>
    );
  } else {
    return (
      <div>
        <h3>Numbers</h3>
        {persons.map((person) => (
          <Person
            key={person.name}
            person={person}
            deleteButton={
              <PersonDeleteButton
                onClickHandler={createDeleteButtonHandler(person)}
              />
            }
          />
        ))}
      </div>
    );
  }
};

const Person = ({ person, deleteButton }) => (
  <p>
    {person.name} {person.number} {deleteButton}
  </p>
);

const PersonDeleteButton = ({ onClickHandler }) => (
  <button onClick={onClickHandler}>delete</button>
);
