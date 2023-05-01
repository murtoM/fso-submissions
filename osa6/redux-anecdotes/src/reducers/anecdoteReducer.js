import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const anecdote = action.payload;
      return state.map((a) => (a.id !== anecdote.id ? a : anecdote));
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(_state, action) {
      return action.payload;
    },
  },
});

export const { updateAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => async (dispatch) => {
  const anecdotes = await anecdoteService.getAll();
  dispatch(setAnecdotes(anecdotes));
};

export const createAnecdote = (content) => async (dispatch) => {
  const newAnecdote = await anecdoteService.createNew(content);
  dispatch(appendAnecdote(newAnecdote));
};

export const voteAnecdote = (id) => async (dispatch, getState) => {
  const { anecdotes } = await getState();
  const anecdote = anecdotes.find((a) => a.id === id);
  const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };

  await anecdoteService.update(id, votedAnecdote);
  dispatch(updateAnecdote(votedAnecdote));
};

export default anecdoteSlice.reducer;
