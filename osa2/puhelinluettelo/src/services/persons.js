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

const pushNew = (newPerson) =>
  new Promise((resolve, reject) => {
    axios
      .post(SERVER_URL, newPerson)
      .then((response) => resolve(console.log(response)))
      .catch((error) => reject(error));
  });

export { getAll, pushNew };
