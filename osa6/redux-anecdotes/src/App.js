import { useSelector, useDispatch } from "react-redux";

import { voteAnecdote, createAnecdote } from "./reducers/anecdoteReducer";

const App = () => {
  const anecdoteVoteCompare = (anecdote0, anecdote1) => {
    if (anecdote0.votes < anecdote1.votes) return 1;
    else if (anecdote0.votes > anecdote1.votes) return -1;
    return 0;
  };
  const anecdotes = useSelector((state) => state.sort(anecdoteVoteCompare));
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAnecdote(id));
  };

  const addAnecdote = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    dispatch(createAnecdote(content));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input type="text" name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default App;
