const mongoose = require("mongoose");

function displayHelpAndExit() {
  let usageHelp = `
    Usage:
      node mongo.js <dbPassword> <PersonName> <PersonNumber>
  `;
  console.log(usageHelp);
  process.exit(1);
}

// not enough arguments, display help
if (process.argv.length < 3) {
  console.error("Give password as argument\n");
  displayHelpAndExit();
}

const password = process.argv[2];
const url = `mongodb+srv://markus:${password}@fso.41lzfkw.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Person = mongoose.model("Person", personSchema);

// display phonebook contents
if (process.argv.length == 3) {
  mongoose.connect(url);

  Person.find({}).then((result) => {
    if (result.length == 0){
      console.log("phonebook empty!");
    } else {
      console.log("phonebook:");
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      })
    }
    mongoose.connection.close();
  });
  // not enough arguments, display help
} else if (process.argv.length < 5) {
  console.error("Give all details for Person\n");
  displayHelpAndExit();
} else {
  // enough arguments to add a new Person
  const personName = process.argv[3];
  const personNumber = process.argv[4];

  const person = new Person({
    name: personName,
    number: personNumber,
  });

  mongoose.connect(url);
  person.save().then((result) => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
  });
}
