import { createSlice } from "@reduxjs/toolkit";

const noteSlice = createSlice({
  name: "note",
  initialState: {
    blocs: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotes: (state, action) => {
      state.blocs = action.payload;
      state.loading = false;
    },
    // error
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    changeBloc: (state, action) => {
      const index = state.blocs.findIndex((bloc) => bloc.id === action.payload.id);
      state.blocs[index].text = action.payload.text;
    }
  },
})

export default noteSlice.reducer;

export const { addNotes, setLoading, setError, changeBloc } = noteSlice.actions;