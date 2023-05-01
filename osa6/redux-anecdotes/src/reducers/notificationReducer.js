import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
  },
});

export const createNotification = (message, timeout) => async (dispatch) => {
  dispatch(setNotification(message));
  setTimeout(() => dispatch(setNotification(null)), timeout * 1000);
};

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
