import axios from "axios";

const SERVER_HOST = "http://localhost";
const SERVER_PORT = 3001;

const SERVER_URL = `${SERVER_HOST}:${SERVER_PORT}/persons`;

const getAll = () =>
  new Promise((resolve, reject) => {
    axios
      .get(SERVER_URL)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });

const create = (newPerson) =>
  new Promise((resolve, reject) => {
    axios
      .post(SERVER_URL, newPerson)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });

const remove = (personId) =>
  new Promise((resolve, reject) => {
    axios
      .delete(`${SERVER_URL}/${personId}`)
      .then(resolve(console.log("Deleted person id:", personId)))
      .catch((error) => reject(error));
  });

export { getAll, create, remove };
