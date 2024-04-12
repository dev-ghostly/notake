import { createSlice } from "@reduxjs/toolkit";

const subjectsSlice = createSlice({
  name: "subjects",
  initialState: {
    subjects: [],
    loading: false,
    error: null,
  },
  reducers: {
    addSubjects: (state, action) => {
      state.subjects = action.payload;
    },
  },
});

export default subjectsSlice.reducer;

export const { addSubjects } = subjectsSlice.actions;