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

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
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

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  let newPerson;
  try {
    newPerson = structuredClone(request.body);
  } catch {
    next({ name: "InvalidRequest" });
  }

  if (!newPerson.name || !newPerson.number) {
    next({ name: "ContentMissing" });
  } else {
    Person.create(newPerson)
      .then(() => {
        response.json(newPerson);
      })
      .catch((error) => next(error));
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  let person;
  try {
    person = structuredClone(request.body);
  } catch {
    next({ name: "InvalidRequest" });
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  if (error.message) {
    console.error(error.message);
  }

  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformed id" });
    case "InvalidRequest":
      return response.status(400).send({ error: "invalid request" });
    case "ContentMissing":
      return response.status(400).send({ error: "content missing" });
  }

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
