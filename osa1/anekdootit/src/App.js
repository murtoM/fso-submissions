import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
  ];

  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0));

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <div>{anecdotes[selected]}</div>
      <div>has {points[selected]} votes</div>
      <VoteButton points={points} setPoints={setPoints} selected={selected} />
      <RandomiserButton
        setSelected={setSelected}
        anecdoteCount={anecdotes.length}
      />
      <h2>Anecdote with most votes</h2>
      <MostVotedAnecdote anecdotes={anecdotes} points={points} />
    </div>
  );
};

const VoteButton = ({ points, setPoints, selected }) => {
  const voteSelected = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
  };

  return <button onClick={voteSelected}>vote</button>;
};

const RandomiserButton = ({ setSelected, anecdoteCount }) => {
  const randomiseNext = () =>
    setSelected(Math.floor(Math.random() * anecdoteCount));

  return <button onClick={randomiseNext}>next anecdot</button>;
};

const MostVotedAnecdote = ({ anecdotes, points }) => {
  const mostVotedIndex = points.findIndex((point) => point === Math.max(...points));

  return (
    <div>
      {anecdotes[mostVotedIndex]}
      <br />
      has {points[mostVotedIndex]} votes
    </div>
  );
};

export default App;
