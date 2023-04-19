require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const Person = require("./models/person");

const PORT = process.env.PORT || 3001;

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

morgan.token("posted-json", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  else return " ";
});
app.use(morgan(`${morgan.tiny} :posted-json`));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  Person.estimatedDocumentCount().then((personCount) => {
    response.send(`
      <p>Phonebook has info for ${personCount} people</p>
      <p>${new Date()}</p>
    `);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  let newPerson;
  try {
    newPerson = structuredClone(request.body);
  } catch {
    return response.status(400).json({ error: "invalid request" });
  }

  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({ error: "content missing" });
  }

  Person.create(newPerson);
  response.json(newPerson);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  }

  next(error);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
