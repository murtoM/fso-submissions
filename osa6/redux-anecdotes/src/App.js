import { useSelector, useDispatch } from "react-redux";

import { voteAnecdote } from "./reducers/anecdoteReducer";
import AnecdoteForm from "./components/AnecdoteForm";

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
      <AnecdoteForm />
    </div>
  );
};

export default App;
