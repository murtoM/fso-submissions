const App = () => {
  const course = "Half Stack application development";
  const parts = [
    {
      name: "Fundamentals of React",
      exercises: 10,
    },
    {
      name: "Using props to pass data",
      exercises: 7,
    },
    {
      name: "State of a component",
      exercises: 14,
    },
  ];

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => {
        return <Part part={part} />;
      })}
    </div>
  );
};

const Part = (props) => {
  const name = props.part.name;
  const num = props.part.exercises;

  return (
    <p>
      {name} {num}
    </p>
  );
};

const Total = (props) => {
  let total = 0;
  props.parts.forEach((part) => {
    total += part.exercises;
  });

  return <p>Number of exercises {total}</p>;
};

export default App;
