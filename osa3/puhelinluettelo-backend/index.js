const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const PORT = process.env.PORT || 3001;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

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
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
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

  if (persons.some((person) => person.name === newPerson.name)) {
    return response.status(409).json({ error: "name must be unique" });
  }

  newPerson.id = Math.floor(Math.random() * 100000);

  persons.push(newPerson);
  response.json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
