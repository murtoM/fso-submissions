import { useSelector, useDispatch } from "react-redux";

import { voteAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const anecdoteVoteCompare = (anecdote0, anecdote1) => {
    if (anecdote0.votes < anecdote1.votes) return 1;
    else if (anecdote0.votes > anecdote1.votes) return -1;
    return 0;
  };
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter) {
      return anecdotes
        .filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
        .sort(anecdoteVoteCompare);
    }
    return [...anecdotes].sort(anecdoteVoteCompare);
  });
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAnecdote(id));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
